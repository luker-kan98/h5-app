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
          <router-link :to="`/task/${item.task_id}`"
            :class="statusClass(item.status)"
            class="ml-4 text-xs px-2 py-1 rounded shrink-0">
            {{ item.status }}
          </router-link>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 text-center mt-16">No builds yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBuild } from '@/composables/useBuild'

const { getHistory } = useBuild()
const items = ref<any[]>([])

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
