import { createRouter, createWebHistory } from 'vue-router'
import { HomeView } from '@/pages/home'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/pages/chat/ui/ChatView.vue'),
    },
  ],
})

export default router
