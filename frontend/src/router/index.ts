import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/task/:id', component: () => import('@/views/TaskView.vue') },
    { path: '/history', component: () => import('@/views/HistoryView.vue') },
  ],
})

export default router
