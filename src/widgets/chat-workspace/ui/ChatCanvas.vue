<script lang="ts" setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useUserStore } from '@entities/user/model/userStore'
import { AButton, AUserCard, ATwoColumnCanvas } from '@shared/ui'
import { MessageCircle } from '@lucide/vue'

import '@talkjs/web-components'
import '@talkjs/web-components/default.css'

const userStore = useUserStore()
const appId = userStore.appId
const userId = computed(() => userStore.activeId)
const userName = computed(() => userStore.activeUser)
const conversationId = computed(() => userStore.conversationId)
const talkSession = computed(() => userStore.session)

const excludeCurrentUser = computed(() =>
  userStore.users.filter((user) => user.id !== userId.value),
)

const activeTab = ref<'start' | 'current'>('current')
const isSidebarOpen = ref(true)

const isSiteDark = ref(
  localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark'),
)

const themeObserver = new MutationObserver(() => {
  isSiteDark.value = document.documentElement.classList.contains('dark')
})

watch(
  [userId, talkSession],
  ([newId, currentSession]) => {
    if (newId && currentSession) {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
    } else {
      themeObserver.disconnect()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  themeObserver.disconnect()
})

function handleConversationId(event: { conversation?: { id: string } }) {
  const cId = event.conversation?.id
  if (cId) {
    userStore.setConversationId(cId)
    if (window.innerWidth < 640) {
      isSidebarOpen.value = false
    }
  }
}

async function handleStartChat(targetUser: (typeof userStore.users)[number]) {
  if (!targetUser.id || !targetUser.name) return
  try {
    await userStore.startConversationWithUser({
      id: targetUser.id,
      name: targetUser.name,
    })
    activeTab.value = 'current'
    if (window.innerWidth < 640) {
      isSidebarOpen.value = false
    }
  } catch (err) {
    console.error('UI Action error block:', err)
  }
}
</script>

<template>
  <ATwoColumnCanvas v-model:open="isSidebarOpen" class="chat-canvas-viewport">
    <template #sidebar>
      <div class="tabs-header">
        <AButton
          variant="ghost"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'start' }"
          @click="activeTab = 'start'"
        >
          Start
        </AButton>
        <AButton
          variant="ghost"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'current' }"
          @click="activeTab = 'current'"
        >
          Chats
        </AButton>
      </div>

      <div class="sidebar-scroll-panel">
        <div v-show="activeTab === 'start'" class="start-conversation">
          <AButton
            v-for="user in excludeCurrentUser"
            :key="user.id"
            variant="ghost"
            class="user-row-trigger"
            @click="handleStartChat(user)"
          >
            <AUserCard :name="user.name || ''" :photo-url="user.photoUrl || ''" />
          </AButton>
        </div>

        <t-conversation-list
          v-show="activeTab === 'current' && userId && talkSession"
          :key="`${userId}_has_session`"
          :app-id="appId"
          :user-id="userId"
          :theme="isSiteDark ? 'default_dark' : 'default'"
          @select-conversation="handleConversationId"
        />
      </div>

      <div class="tabs-footer">
        <div class="footer-content">Welcome back {{ userName }}!</div>
      </div>
    </template>

    <t-chatbox
      v-if="conversationId && userId && talkSession"
      :key="`${conversationId}_has_session`"
      :app-id="appId"
      :user-id="userId"
      :conversation-id="conversationId"
      :theme="isSiteDark ? 'default_dark' : 'default'"
    />
    <div v-else class="empty-chat-state">
      <div class="empty-graphic"><MessageCircle height="70" width="70" /></div>
      <h3>No Conversation Active</h3>
      <p>
        Choose a user from the menu sidebar panel to open a live encrypted message thread
        connection.
      </p>
    </div>
  </ATwoColumnCanvas>
</template>

<style lang="less" scoped>
.chat-canvas-viewport {
  height: @full-height;
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: @spacing-xs;
  padding: @spacing-s;
  border-bottom: 1px solid @color-border;
  height: @header-height;
  align-items: center;
  .tab-btn {
    flex: 1;
    font-size: @text-sm;
    font-weight: @weight-medium;
    border-radius: @border-radius-m;
    height: 100%;
    &.is-active {
      background-color: @color-background-soft;
      color: @color-primary;
      font-weight: @weight-bold;
    }
  }
}

.tabs-footer {
  display: flex;
  justify-content: end;
  padding: @spacing-s;
  font-size: @text-sm;
  color: @color-text;
  opacity: 0.8;
  border-top: 1px solid @color-border;
}

.sidebar-scroll-panel {
  flex: 1;
  overflow-y: auto;
}

.start-conversation {
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
  height: calc(@full-height - @header-height);
  padding: @spacing-s;
}

.user-row-trigger.a-button {
  background: transparent;
  border-radius: @border-radius-m;
  border: none;
  overflow: hidden;
  padding: 0;
  width: 100%;
  &:hover:not(:disabled) {
    :deep(.a-user-card) {
      background-color: @color-background-soft;
      border-color: @color-border-hover;
    }
  }
}

t-conversation-list {
  height: calc(@full-height - @header-height);
  width: 100%;
}

t-chatbox {
  height: @full-height;
  width: 100%;
}

.empty-chat-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: @spacing-xl;
  text-align: center;
  color: @color-text;
  .empty-graphic {
    margin-bottom: @spacing-m;
    opacity: 0.6;
    color: @color-primary;
  }
  h3 {
    color: @color-heading;
    font-weight: @weight-bold;
    font-size: @text-lg;
    margin-bottom: @spacing-xs;
  }
  p {
    max-width: 360px;
    font-size: @text-sm;
    line-height: @lh-normal;
    opacity: 0.8;
  }
}
</style>
