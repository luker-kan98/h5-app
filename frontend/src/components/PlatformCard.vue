<template>
  <div class="border rounded-lg p-4 flex items-center justify-between">
    <div>
      <p class="font-medium text-sm">{{ label }}</p>
      <p class="text-xs mt-0.5" :class="statusColor">{{ statusText }}</p>
      <p v-if="platform.error" class="text-xs text-red-500 mt-1 max-w-xs truncate">{{ platform.error }}</p>
    </div>
    <button v-if="platform.download_url" @click="handleDownload"
      :disabled="downloading"
      class="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50">
      {{ downloading ? 'Downloading…' : 'Download' }}
    </button>
    <span v-else-if="platform.status === 'running'"
      class="text-xs text-blue-500 animate-pulse">Building…</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import client from '@/api/client'

const props = defineProps<{
  label: string
  platform: { status: string; download_url?: string | null; error?: string | null }
}>()

const downloading = ref(false)

async function handleDownload() {
  if (!props.platform.download_url) return
  downloading.value = true
  try {
    const res = await client.get(props.platform.download_url, { responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = props.platform.download_url.split('/').pop() || 'download'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    alert('Download failed')
  } finally {
    downloading.value = false
  }
}

const statusColor = computed(() => ({
  done: 'text-green-600',
  failed: 'text-red-500',
  running: 'text-blue-500',
  pending: 'text-gray-400',
}[props.platform.status] ?? 'text-gray-400'))

const statusText = computed(() => ({
  done: 'Ready to download',
  failed: 'Build failed',
  running: 'Building…',
  pending: 'Queued',
}[props.platform.status] ?? props.platform.status))
</script>
