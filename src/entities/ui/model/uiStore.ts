import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isSidebarOpen = ref<boolean>(true)

  function setSidebarOpen(value: boolean) {
    isSidebarOpen.value = value
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return {
    isSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  }
})
