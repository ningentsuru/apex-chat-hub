<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { getTalkSession } from '@talkjs/core'

import '@talkjs/web-components'
import '@talkjs/web-components/default.css'

const userStore = useUserStore()
const appId = import.meta.env.VITE_APP_TALKJS_APP_ID

const userId = computed(() => userStore.activeId)

const session = ref<unknown>(null)

watch(
  userId,
  (newId) => {
    if (newId) {
      session.value = getTalkSession({
        appId: appId,
        userId: newId,
      })
    } else {
      session.value = null
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="chat-canvas">
    <t-inbox
      v-if="userId"
      :key="userId"
      :app-id="appId"
      :user-id="userId"
      :show-feed-header="true"
      :allow-create-conversation="true"
    />
  </section>
</template>

<style lang="less" scoped>
t-inbox {
  width: 100%;
  height: @full-height;
}
</style>
