<template>
  <div class="border rounded">
    <button type="button" @click="open = !open"
      class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
      <span>SDK & Tracking</span>
      <span class="text-xs text-gray-500">{{ open ? 'Hide' : 'Show' }}</span>
    </button>
    <div v-if="open" class="border-t p-3 space-y-4">
      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">Custom JS</label>
        <textarea v-model="localCustomJs" rows="4" :maxlength="maxCustomJsChars"
          placeholder="// Runs on every page load — paste GA4, 百度统计, Mixpanel, etc."
          class="w-full border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:ring"></textarea>
        <p class="mt-1 text-xs text-gray-500">{{ localCustomJs.length }} / {{ maxCustomJsChars }}</p>
      </div>

      <div v-if="loadError" class="text-xs text-red-500">Failed to load SDK catalog: {{ loadError }}</div>

      <div v-for="sdk in catalog" :key="sdk.id" class="border rounded p-3 space-y-2">
        <label class="flex items-center justify-between cursor-pointer">
          <span class="text-sm font-medium text-gray-700">
            {{ sdk.name_zh }}
            <span class="text-xs text-gray-500 ml-1">{{ sdk.name_en }} · {{ sdk.category }}</span>
          </span>
          <input type="checkbox" :checked="!!enabled[sdk.id]" @change="toggleSdk(sdk)" />
        </label>
        <p v-if="enabled[sdk.id] && unsupportedFor(sdk).length"
          class="text-xs text-amber-600">
          Not supported on: {{ unsupportedFor(sdk).join(', ') }} (will be skipped)
        </p>
        <div v-if="enabled[sdk.id]" class="space-y-2">
          <div v-for="f in visibleFieldsFor(sdk)" :key="f.name">
            <label class="text-xs text-gray-600 block mb-0.5">
              {{ f.label_en }}{{ f.required ? ' *' : '' }}
              <span v-if="f.help_zh" class="text-gray-400 ml-1">{{ f.help_zh }}</span>
            </label>
            <input
              v-if="f.widget === 'text' || f.widget === undefined"
              :type="f.secret ? 'password' : 'text'"
              v-model="values[sdk.id][f.name]"
              :placeholder="f.placeholder || ''"
              class="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring"
            />
            <textarea
              v-else-if="f.widget === 'textarea'"
              v-model="values[sdk.id][f.name]"
              :placeholder="f.placeholder || ''"
              rows="4"
              class="w-full border rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring"
            />
            <input
              v-else-if="f.widget === 'number'"
              type="number"
              min="0"
              step="0.1"
              v-model="values[sdk.id][f.name]"
              :placeholder="f.placeholder || ''"
              class="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring"
            />
            <label v-else-if="f.widget === 'checkbox'" class="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                :checked="values[sdk.id][f.name] === 'true'"
                @change="onCheckbox($event, sdk.id, f.name)"
              />
              <span>{{ f.placeholder || '' }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import client from '@/api/client'

interface SdkField {
  name: string
  label_en: string
  label_zh: string
  required: boolean
  secret: boolean
  platforms: string[]
  widget?: 'text' | 'textarea' | 'number' | 'checkbox'
  placeholder?: string
  help_zh?: string
}
interface SdkDefinition {
  id: string
  name_en: string
  name_zh: string
  category: string
  supported_platforms: string[]
  fields: SdkField[]
}

const props = defineProps<{ selectedPlatforms: string[] }>()
const emit = defineEmits<{
  (e: 'update', payload: { customJs: string; sdkConfigs: Record<string, Record<string, string>> }): void
}>()

const open = ref(false)
const maxCustomJsChars = 50000
const localCustomJs = ref('')
const catalog = ref<SdkDefinition[]>([])
const loadError = ref<string | null>(null)
const enabled = reactive<Record<string, boolean>>({})
const values = reactive<Record<string, Record<string, string>>>({})

onMounted(async () => {
  try {
    const { data } = await client.get('/sdk-catalog')
    catalog.value = data.sdks
    for (const sdk of catalog.value) {
      enabled[sdk.id] = false
      values[sdk.id] = {}
      for (const f of sdk.fields) values[sdk.id][f.name] = ''
    }
  } catch (e: any) {
    loadError.value = e?.message ?? 'unknown error'
  }
})

function toggleSdk(sdk: SdkDefinition) {
  enabled[sdk.id] = !enabled[sdk.id]
}

function onCheckbox(event: Event, sdkId: string, name: string) {
  const target = event.target as HTMLInputElement
  values[sdkId][name] = target.checked ? 'true' : 'false'
}

function unsupportedFor(sdk: SdkDefinition): string[] {
  return props.selectedPlatforms.filter((p) => !sdk.supported_platforms.includes(p))
}

function visibleFieldsFor(sdk: SdkDefinition): SdkField[] {
  const active = new Set(props.selectedPlatforms.filter((p) => sdk.supported_platforms.includes(p)))
  return sdk.fields.filter((f) => f.platforms.length === 0 || f.platforms.some((p) => active.has(p)))
}

const payload = computed(() => {
  const sdkConfigs: Record<string, Record<string, string>> = {}
  for (const sdk of catalog.value) {
    if (!enabled[sdk.id]) continue
    const fields = visibleFieldsFor(sdk)
    const cleaned: Record<string, string> = {}
    for (const f of fields) {
      const v = values[sdk.id]?.[f.name] ?? ''
      if (v.trim() !== '') cleaned[f.name] = v
    }
    sdkConfigs[sdk.id] = cleaned
  }
  return { customJs: localCustomJs.value, sdkConfigs }
})

watch(payload, (p) => emit('update', p), { deep: true })
</script>
