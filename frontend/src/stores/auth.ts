import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('jwt_token'))

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('jwt_token', t)
  }

  function logout() {
    token.value = null
    localStorage.removeItem('jwt_token')
  }

  return { token, isLoggedIn, setToken, logout }
})
