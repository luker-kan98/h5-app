import { ref } from 'vue'
import client from '@/api/client'

export interface BuildSubmitPayload {
  h5_url: string
  platforms: string[]
  app_name: string
  icon_file: File
  android_package_name?: string
}

export function useBuild() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function submitBuild(payload: BuildSubmitPayload): Promise<string> {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('h5_url', payload.h5_url)
      formData.append('app_name', payload.app_name)
      formData.append('icon_file', payload.icon_file)
      for (const platform of payload.platforms) {
        formData.append('platforms', platform)
      }
      if (payload.android_package_name) {
        formData.append('android_package_name', payload.android_package_name)
      }

      const { data } = await client.post('/build', formData)
      return data.task_id
    } catch (e: any) {
      error.value = e.response?.data?.detail ?? 'Submission failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getStatus(task_id: string) {
    const { data } = await client.get(`/build/${task_id}`)
    return data
  }

  async function getHistory() {
    const { data } = await client.get('/builds/history')
    return data
  }

  async function rebuildBuild(requestId: string): Promise<string> {
    loading.value = true
    error.value = null
    try {
      const { data } = await client.post(`/rebuild/${requestId}`)
      return data.task_id
    } catch (e: any) {
      error.value = e.response?.data?.detail ?? 'Rebuild failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, submitBuild, getStatus, getHistory, rebuildBuild }
}
