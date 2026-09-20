<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@entities/user/model/userStore'
import { AButton, AUserCard } from '@shared/ui'

interface Props {
  id: string
  name: string
  photoUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  name: '',
  photoUrl: '',
})

const userStore = useUserStore()
const router = useRouter()

const isActive = computed(() => userStore.activeId === props.id)

function handleSelectUser() {
  userStore.setActiveId(props.id)
  router.push({ name: 'chat' })
}
</script>

<template>
  <AButton variant="ghost" class="impersonate-user-row-trigger" @click="handleSelectUser">
    <AUserCard :name="name" :photo-url="photoUrl" :is-active="isActive" />
  </AButton>
</template>

<style lang="less" scoped>
.impersonate-user-row-trigger.a-button {
  background: transparent;
  border-radius: @border-radius-m;
  border: none;
  overflow: hidden;
  padding: 0;
  width: 100%;

  &:hover:not(:disabled) {
    :deep(.a-user-card) {
      background-color: @color-background-soft;
      border-color: @color-primary;
      color: @color-heading;
    }
  }

  .button-content {
    width: 100%;
  }
}
</style>
