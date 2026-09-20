<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AButton } from '@shared/ui'
import { Sun, Moon } from '@lucide/vue'

const isDark = ref(false)

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
    <RouterLink :to="{ name: 'home' }" class="logo-link"> Apex Chat Hub </RouterLink>

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
