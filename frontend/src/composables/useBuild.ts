import { ref } from 'vue'
import client from '@/api/client'

export function useBuild() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function submitBuild(h5_url: string, platforms: string[]): Promise<string> {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('h5_url', h5_url)
      for (const platform of platforms) {
        formData.append('platforms', platform)
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

  return { loading, error, submitBuild, getStatus, getHistory }
}
