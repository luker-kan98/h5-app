<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-lg mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <router-link to="/" class="text-blue-600 text-sm hover:underline">← New Build</router-link>
        <span class="text-gray-400 text-sm">|</span>
        <router-link to="/history" class="text-blue-600 text-sm hover:underline">History</router-link>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h1 class="text-lg font-bold mb-1">Build Status</h1>
        <p v-if="job" class="text-xs text-gray-400 mb-4 truncate">{{ job.h5_url }}</p>
        <div v-if="job" class="space-y-3">
          <PlatformCard
            v-for="(pData, pKey) in job.platforms"
            :key="pKey"
            :label="platformLabels[pKey] ?? pKey"
            :platform="pData"
          />
        </div>
        <p v-else class="text-sm text-gray-400">Loading…</p>
        <p v-if="job?.status === 'done' || job?.status === 'failed'"
          class="mt-4 text-xs text-gray-400 text-center">
          Build finished · <router-link to="/" class="text-blue-600 hover:underline">Start a new one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBuild } from '@/composables/useBuild'
import PlatformCard from '@/components/PlatformCard.vue'

const route = useRoute()
const { getStatus } = useBuild()

const job = ref<any>(null)
let timer: ReturnType<typeof setInterval> | null = null

const platformLabels: Record<string, string> = {
  android: 'Android',
  ios: 'iOS (unsigned)',
  macos: 'macOS',
  windows: 'Windows',
}

async function poll() {
  try {
    job.value = await getStatus(route.params.id as string)
    if (job.value.status === 'done' || job.value.status === 'failed') {
      if (timer) clearInterval(timer)
    }
  } catch {
    // token expired or network error — stop polling
    if (timer) clearInterval(timer)
  }
}

onMounted(() => {
  poll()
  timer = setInterval(poll, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
