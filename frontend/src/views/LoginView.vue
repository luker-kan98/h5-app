<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white rounded-xl shadow p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">H5 App Packager</h1>
      <div class="flex mb-4 border-b">
        <button
          v-for="tab in ['login', 'register']"
          :key="tab"
          class="flex-1 py-2 text-sm font-medium capitalize"
          :class="activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'"
          @click="activeTab = tab as 'login' | 'register'"
        >{{ tab }}</button>
      </div>
      <form @submit.prevent="submit" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
        <input v-model="password" type="password" placeholder="Password"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
        <button type="submit"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700">
          {{ activeTab === 'login' ? 'Login' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, register } = useAuth()
const activeTab = ref<'login' | 'register'>('login')
const username = ref('')
const password = ref('')
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  try {
    if (activeTab.value === 'login') {
      await login(username.value, password.value)
    } else {
      await register(username.value, password.value)
    }
  } catch (e: any) {
    errorMsg.value = e.response?.data?.detail ?? 'Something went wrong'
  }
}
</script>
