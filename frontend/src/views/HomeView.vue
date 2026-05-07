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
          <label class="text-sm font-medium text-gray-700 block mb-1">App Name</label>
          <input v-model="appName" type="text" maxlength="64" placeholder="My App"
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
        <div v-if="isAndroidSelected">
          <label class="text-sm font-medium text-gray-700 block mb-1">Android Package Name</label>
          <input v-model="androidPackageName" type="text" placeholder="com.example.app"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
          <p class="mt-1 text-xs text-gray-500">Use lowercase segments such as <code>com.example.app</code>.</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">App Icon</label>
          <input type="file" accept="image/png" @change="onIconChange"
            class="block w-full text-sm text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700" />
          <p class="mt-1 text-xs text-gray-500">Upload a square PNG that is at least 1024x1024. The server will resize it for each platform.</p>
          <p v-if="iconFile" class="mt-1 text-xs text-gray-500">Selected: {{ iconFile.name }}</p>
        </div>
        <SdkConfigSection :selected-platforms="selectedPlatforms" @update="onSdkUpdate" />
        <p v-if="displayError" class="text-red-500 text-sm">{{ displayError }}</p>
        <button @click="submit" :disabled="!canSubmit"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Submitting…' : 'Start Packaging' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBuild } from '@/composables/useBuild'
import SdkConfigSection from '@/components/SdkConfigSection.vue'

const { logout } = useAuth()
const { submitBuild, loading, error } = useBuild()
const router = useRouter()

const h5Url = ref('')
const appName = ref('')
const androidPackageName = ref('')
const iconFile = ref<File | null>(null)
const formError = ref<string | null>(null)
const selectedPlatforms = ref<string[]>(['android'])
const customJs = ref('')
const sdkConfigs = ref<Record<string, Record<string, string>>>({})

function onSdkUpdate(payload: { customJs: string; sdkConfigs: Record<string, Record<string, string>> }) {
  customJs.value = payload.customJs
  sdkConfigs.value = payload.sdkConfigs
}
const allPlatforms = [
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS (unsigned)' },
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
]

const androidPackagePattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/

const isAndroidSelected = computed(() => selectedPlatforms.value.includes('android'))
const displayError = computed(() => formError.value ?? error.value)
const canSubmit = computed(() => {
  if (loading.value || !selectedPlatforms.value.length || !appName.value.trim() || !iconFile.value) {
    return false
  }
  if (isAndroidSelected.value && !androidPackageName.value.trim()) {
    return false
  }
  return true
})

function onIconChange(event: Event) {
  const input = event.target as HTMLInputElement
  iconFile.value = input.files?.[0] ?? null
  formError.value = null
}

function validateAndroidPackageName(value: string): string | null {
  if (!androidPackagePattern.test(value)) {
    return 'Android package name must look like com.example.app'
  }
  return null
}

async function validateIcon(file: File): Promise<string | null> {
  if (file.type !== 'image/png') {
    return 'Icon must be a PNG image'
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve({ width: image.width, height: image.height })
      image.onerror = () => reject(new Error('Icon must be a valid PNG image'))
      image.src = objectUrl
    })

    if (dimensions.width !== dimensions.height) {
      return 'Icon must be a square image'
    }
    if (dimensions.width < 1024 || dimensions.height < 1024) {
      return 'Icon must be at least 1024x1024 pixels'
    }
    return null
  } catch (submitError: unknown) {
    if (submitError instanceof Error) {
      return submitError.message
    }
    return 'Icon must be a valid PNG image'
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function submit() {
  formError.value = null

  if (!h5Url.value.trim()) {
    formError.value = 'H5 URL is required'
    return
  }
  if (!appName.value.trim()) {
    formError.value = 'App name is required'
    return
  }
  if (!iconFile.value) {
    formError.value = 'App icon is required'
    return
  }
  if (isAndroidSelected.value) {
    const packageError = validateAndroidPackageName(androidPackageName.value.trim())
    if (packageError) {
      formError.value = packageError
      return
    }
  }

  const iconError = await validateIcon(iconFile.value)
  if (iconError) {
    formError.value = iconError
    return
  }

  try {
    const taskId = await submitBuild({
      h5_url: h5Url.value.trim(),
      platforms: selectedPlatforms.value,
      app_name: appName.value.trim(),
      icon_file: iconFile.value,
      android_package_name: isAndroidSelected.value ? androidPackageName.value.trim() : undefined,
      custom_js: customJs.value || undefined,
      sdk_configs: Object.keys(sdkConfigs.value).length ? sdkConfigs.value : undefined,
    })
    router.push(`/task/${taskId}`)
  } catch {
    // error is displayed via useBuild's error ref
  }
}
</script>
