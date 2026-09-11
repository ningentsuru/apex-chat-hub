import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const activeId = ref<string>('')
  const users = ref<User[]>([])

  function setActiveId(id: string) {
    activeId.value = id
  }

  function setUsers(data: User[]) {
    users.value = data
  }

  return { activeId, users, setActiveId, setUsers }
})
