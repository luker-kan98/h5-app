'use strict';

const FETCH_TIMEOUT_MS = 5000;
const PROBE_TIMEOUT_MS = 3000;

async function resolveReachableUrl({ originalUrl, domainConfigUrls }) {
  if (!Array.isArray(domainConfigUrls) || domainConfigUrls.length === 0) {
    return originalUrl;
  }

  const candidates = await fetchCandidates(domainConfigUrls);
  if (candidates.length === 0) return originalUrl;

  const original = new URL(originalUrl);
  for (const domain of candidates) {
    const candidate = new URL(originalUrl);
    candidate.host = domain;
    if (await isReachable(candidate.toString())) {
      console.log('domain-resolver: selected', candidate.toString());
      return candidate.toString();
    }
  }

  console.log('domain-resolver: no candidate reachable, falling back to', original.toString());
  return originalUrl;
}

async function fetchCandidates(configUrls) {
  for (const url of configUrls) {
    try {
      const response = await fetchWithTimeout(url, { method: 'GET' }, FETCH_TIMEOUT_MS);
      if (!response.ok) continue;
      const text = await response.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('#'));
      if (lines.length > 0) return lines;
    } catch (e) {
      console.warn('domain-resolver: fetch', url, 'failed:', e.message);
    }
  }
  return [];
}

async function isReachable(url) {
  try {
    const head = await fetchWithTimeout(url, { method: 'HEAD' }, PROBE_TIMEOUT_MS);
    if (head.status >= 200 && head.status < 400) return true;
    if (head.status === 405 || head.status === 501) {
      const get = await fetchWithTimeout(url, { method: 'GET' }, PROBE_TIMEOUT_MS);
      return get.status >= 200 && get.status < 400;
    }
    return false;
  } catch (e) {
    console.warn('domain-resolver: probe', url, 'failed:', e.message);
    return false;
  }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { resolveReachableUrl };
