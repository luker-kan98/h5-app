import client from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  async function login(username: string, password: string) {
    const { data } = await client.post('/auth/login', { username, password })
    auth.setToken(data.access_token)
    router.push('/')
  }

  async function register(username: string, password: string) {
    const { data } = await client.post('/auth/register', { username, password })
    auth.setToken(data.access_token)
    router.push('/')
  }

  function logout() {
    auth.logout()
    router.push('/login')
  }

  return { login, register, logout }
}
