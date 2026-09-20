<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { AButton } from '@shared/ui'
import { Sun, Moon, Menu, X } from '@lucide/vue'
import { useUiStore } from '@entities/ui/model/uiStore'

const uiStore = useUiStore()
const route = useRoute()

const isDark = ref(false)

const isChatPath = computed(() => route.name === 'chat' || route.path === '/chat')

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <AButton
        v-if="isChatPath"
        variant="ghost"
        size="sm"
        class="sidebar-toggle-btn"
        @click="uiStore.toggleSidebar()"
        :aria-label="uiStore.isSidebarOpen ? 'Show side panel' : 'Hide side panel'"
      >
        <X v-if="uiStore.isSidebarOpen" />
        <Menu v-else />
      </AButton>

      <RouterLink :to="{ name: 'home' }" class="logo-link"> Apex Chat Hub </RouterLink>
    </div>

    <AButton
      variant="ghost"
      size="sm"
      @click="toggleTheme"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <Moon v-if="isDark" />
      <Sun v-else />
    </AButton>
  </header>
</template>

<style lang="less" scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: @header-height;
  padding: 0 @spacing-m;
  border-bottom: 1px solid @color-border;
  background-color: @color-background;
  transition: @transition-color;
}

.header-left {
  display: flex;
  align-items: center;
  gap: @spacing-s;
}

.sidebar-toggle-btn {
  padding: 0 !important;
  height: 36px;
  width: 36px;
  border-radius: @border-radius-m;
  color: @color-text;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: @transition-fast;

  .mobile-mode({
    display: none
  });

  &:hover {
    color: @color-heading;
    background-color: @color-background-soft !important;
  }

  .arrow-icon {
    font-size: @text-lg;
    font-weight: @weight-bold;
    line-height: 1;
    font-family: monospace, sans-serif;
  }
}

.logo-link {
  font-weight: @weight-bold;
  font-size: @text-lg;
  color: @color-heading;

  &:hover {
    color: @color-primary;
    background: transparent;
  }
}
</style>
