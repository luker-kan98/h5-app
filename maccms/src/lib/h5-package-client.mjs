import axios from "axios";

const ABSOLUTE_URL_RE = /^https?:\/\//i;

export function sanitizeApiBaseUrl(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.replace(/\/+$/, "");
}

export function getApiBaseUrl(
  envValue = process.env.NEXT_PUBLIC_H5_PACKAGE_API_BASE_URL,
) {
  return sanitizeApiBaseUrl(envValue);
}

export function resolveApiUrl(path, apiBaseUrl = getApiBaseUrl()) {
  const target = typeof path === "string" ? path.trim() : "";
  const normalizedBase = sanitizeApiBaseUrl(apiBaseUrl);

  if (!target) {
    return normalizedBase || "";
  }
  if (ABSOLUTE_URL_RE.test(target)) {
    return target;
  }

  const normalizedPath = target.startsWith("/") ? target : `/${target}`;
  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath;
}

export function getDownloadFilename(url) {
  const normalized = typeof url === "string" ? url : "";
  const cleanUrl = normalized.split("?")[0].split("#")[0];
  const segments = cleanUrl.split("/").filter(Boolean);
  return decodeURIComponent(segments.at(-1) || "download");
}

export function getApiErrorMessage(
  error,
  fallback = "请求失败，请稍后重试",
) {
  return error?.response?.data?.detail ?? fallback;
}

export async function submitBuild({
  payload,
  apiBaseUrl = getApiBaseUrl(),
}) {
  const client = createClient(apiBaseUrl);
  const formData = new FormData();

  formData.append("h5_url", payload.h5_url);
  formData.append("app_name", payload.app_name);
  formData.append("icon_file", payload.icon_file);

  for (const platform of payload.platforms) {
    formData.append("platforms", platform);
  }

  if (payload.android_package_name) {
    formData.append("android_package_name", payload.android_package_name);
  }

  const { data } = await client.post("/build", formData);
  return data;
}

export async function fetchBuildStatus({
  taskId,
  apiBaseUrl = getApiBaseUrl(),
}) {
  const client = createClient(apiBaseUrl);
  const { data } = await client.get(`/build/${taskId}`);
  return data;
}

export async function fetchBuildHistory({
  apiBaseUrl = getApiBaseUrl(),
} = {}) {
  const client = createClient(apiBaseUrl);
  const { data } = await client.get("/builds/history");
  return data;
}

export async function downloadBuildArtifact({
  downloadUrl,
  apiBaseUrl = getApiBaseUrl(),
}) {
  if (!downloadUrl) {
    throw new Error("Download URL is required");
  }

  const target = resolveApiUrl(downloadUrl, apiBaseUrl);
  const link = document.createElement("a");
  link.href = target;
  link.target = "_blank";
  link.rel = "noopener";
  link.download = getDownloadFilename(target);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function createClient(apiBaseUrl) {
  const normalizedBase = sanitizeApiBaseUrl(apiBaseUrl);
  return axios.create({
    baseURL: normalizedBase || undefined,
  });
}
