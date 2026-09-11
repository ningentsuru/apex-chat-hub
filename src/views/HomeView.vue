<script setup lang="ts">
import { ref } from 'vue'
import ImpersonateUser from '@/components/ImpersonateUser.vue'
import AddUserModal from '@/components/AddUserModal.vue'

const isModalOpen = ref(false)

const handleUserCreation = async (payload: { name: string; email: string; photoUrl: string }) => {
  try {
    const clientUuid = `client_${crypto.randomUUID()}`

    const response = await fetch(`/talkjs-api/users/${clientUuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: [payload.email],
        photoUrl: payload.photoUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to synchronize new profile instance to TalkJS engine database.')
    }

    console.log('Successfully registered user with TalkJS ID:', clientUuid)

    window.dispatchEvent(new CustomEvent('refresh-client-list'))
  } catch (error) {
    console.error('Failed processing backend request:', error)
  }
}
</script>

<template>
  <main class="home-view">
    <ImpersonateUser />

    <button class="sticky-btn" @click="isModalOpen = true">Add User +</button>

    <AddUserModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleUserCreation"
    />
  </main>
</template>

<style lang="less" scoped>
main {
  .main-flex();
  gap: 10px;
}

.sticky-btn {
  .background-and-text();
  bottom: 5vh;
  padding: 10px 20px;
  position: sticky;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    .background-and-text-invert();
  }
}
</style>
