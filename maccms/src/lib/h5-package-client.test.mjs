import test from 'node:test'
import assert from 'node:assert/strict'

import {
  sanitizeApiBaseUrl,
  resolveApiUrl,
  getDownloadFilename,
} from './h5-package-client.mjs'

test('sanitizeApiBaseUrl removes trailing slashes', () => {
  assert.equal(sanitizeApiBaseUrl('https://api.example.com///'), 'https://api.example.com')
})

test('resolveApiUrl keeps same-origin paths when api base url is empty', () => {
  assert.equal(resolveApiUrl('/build', ''), '/build')
})

test('resolveApiUrl prefixes relative api paths with the configured api base url', () => {
  assert.equal(
    resolveApiUrl('/files/task-id/android.apk', 'https://api.example.com/'),
    'https://api.example.com/files/task-id/android.apk',
  )
})

test('resolveApiUrl leaves absolute urls untouched', () => {
  assert.equal(
    resolveApiUrl('https://cdn.example.com/builds/windows.exe', 'https://api.example.com'),
    'https://cdn.example.com/builds/windows.exe',
  )
})

test('getDownloadFilename extracts the filename from a download url', () => {
  assert.equal(getDownloadFilename('/files/task-id/ios-unsigned.app.zip'), 'ios-unsigned.app.zip')
})
