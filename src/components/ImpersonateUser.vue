<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ImpersonateUserRow from './ImpersonateUserRow.vue'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/types'

const userStore = useUserStore()
const isLoading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const clients = computed(() => userStore.users)

let abortController: AbortController | null = null

async function fetchTalkJsUsers() {
  try {
    isLoading.value = true
    errorMessage.value = null

    abortController = new AbortController()

    const response = await fetch(`/talkjs-api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortController.signal,
    })

    if (!response.ok) {
      throw new Error(`TalkJS API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    userStore.setUsers(
      result.data.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email || '',
        photoUrl: user.photoUrl || 'https://placehold.co',
      })),
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return
    }

    errorMessage.value =
      error instanceof Error ? error.message : 'An unknown network error occurred'
    console.error('Failed to sync TalkJS users:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTalkJsUsers()
})

onUnmounted(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>

<template>
  <section class="impersonate-user">
    <h3>Impersonate User</h3>
    <div class="impersonate-user-wrapper">
      <ImpersonateUserRow
        v-for="client of clients"
        :key="client.id"
        :id="client.id ?? ''"
        :name="client.name ?? ''"
        :photo-url="client.photoUrl ?? ' '"
      />
      <span v-if="!clients.length">Loading...</span>
    </div>
  </section>
</template>

<style lang="less" scoped>
.impersonate-user {
  display: flex;
  flex-direction: column;
  justify-self: end;
  width: 90%;
}

.impersonate-user-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
</style>
