<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import ChatCanvas from '@/components/ChatCanvas.vue'

const userStore = useUserStore()
const router = useRouter()

onMounted(() => !userStore.activeId && router.push({ name: 'home' }))
</script>

<template>
  <main class="chat-view">
    <ChatCanvas />
  </main>
</template>
