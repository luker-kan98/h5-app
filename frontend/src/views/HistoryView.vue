<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-bold">Build History</h1>
        <router-link to="/" class="text-sm text-blue-600 hover:underline">New Build</router-link>
      </div>
      <div v-if="items.length" class="space-y-3">
        <div v-for="item in items" :key="item.task_id"
          class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ item.h5_url }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ new Date(item.created_at).toLocaleString() }} ·
              {{ item.requested_platforms.join(', ') }}
            </p>
          </div>
          <div class="ml-4 flex items-center gap-2 shrink-0">
            <router-link :to="`/task/${item.task_id}`"
              :class="statusClass(item.status)"
              class="text-xs px-2 py-1 rounded">
              {{ item.status }}
            </router-link>
            <button v-if="item.status === 'failed'"
              @click.prevent="handleRebuild(item)"
              class="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              :disabled="rebuildingId === (item.request_id || item.task_id)">
              重新打包
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 text-center mt-16">No builds yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBuild } from '@/composables/useBuild'

const router = useRouter()
const { getHistory, rebuildBuild } = useBuild()
const items = ref<any[]>([])
const rebuildingId = ref<string | null>(null)

async function handleRebuild(item: any) {
  const id = item.request_id || item.task_id
  rebuildingId.value = id
  try {
    const newTaskId = await rebuildBuild(id)
    router.push(`/task/${newTaskId}`)
  } catch {
    rebuildingId.value = null
  }
}

function statusClass(status: string) {
  return {
    done: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-600',
    running: 'bg-blue-100 text-blue-600',
    pending: 'bg-gray-100 text-gray-500',
  }[status] ?? 'bg-gray-100 text-gray-500'
}

onMounted(async () => {
  try {
    items.value = await getHistory()
  } catch {
    // token expired — router guard will redirect to /login on next navigation
  }
})
</script>
