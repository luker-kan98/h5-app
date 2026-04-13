<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-lg mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Package H5 App</h1>
        <div class="space-x-2">
          <router-link to="/history" class="text-sm text-blue-600 hover:underline">History</router-link>
          <button @click="logout" class="text-sm text-gray-500 hover:underline">Logout</button>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 space-y-5">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">H5 URL</label>
          <input v-model="h5Url" type="url" placeholder="https://your-h5-app.com"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-2">Target Platforms</label>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="p in allPlatforms" :key="p.value"
              class="flex items-center gap-2 border rounded p-2 cursor-pointer hover:bg-gray-50">
              <input type="checkbox" v-model="selectedPlatforms" :value="p.value" />
              <span class="text-sm">{{ p.label }}</span>
            </label>
          </div>
        </div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <button @click="submit" :disabled="loading || !selectedPlatforms.length"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Submitting…' : 'Start Packaging' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBuild } from '@/composables/useBuild'

const { logout } = useAuth()
const { submitBuild, loading, error } = useBuild()
const router = useRouter()

const h5Url = ref('')
const selectedPlatforms = ref<string[]>(['android'])
const allPlatforms = [
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS (unsigned)' },
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
]

async function submit() {
  try {
    const taskId = await submitBuild(h5Url.value, selectedPlatforms.value)
    router.push(`/task/${taskId}`)
  } catch {
    // error is displayed via useBuild's error ref
  }
}
</script>
