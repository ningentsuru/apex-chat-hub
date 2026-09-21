<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore } from '@entities/user/model/userStore'
import { useUiStore } from '@entities/ui/model/uiStore'
import { AButton, AUserCard, ATwoColumnCanvas } from '@shared/ui'
import { MessageCircle } from '@lucide/vue'

import '@talkjs/web-components'
import '@talkjs/web-components/default.css'

const userStore = useUserStore()
const uiStore = useUiStore()
const appId = userStore.appId
const userId = computed(() => userStore.activeId)
const userName = computed(() => userStore.activeUser)
const userPhoto = computed(() => userStore.activePhoto)
const conversationId = computed(() => userStore.conversationId)
const talkSession = computed(() => userStore.session)
const chatboxRef = ref<HTMLElement | null>(null)
let onClick: ((e: Event) => void) | null = null

const excludeCurrentUser = computed(() =>
  userStore.users.filter((user) => user.id !== userId.value),
)

const activeTab = ref<'start' | 'current'>('current')
const isSidebarOpen = computed(() => uiStore.isSidebarOpen)

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

watch(
  chatboxRef,
  (el) => {
    if (!el) return
    onClick = (e: Event) => {
      if (
        !e
          .composedPath()
          .some(
            (n) =>
              (n as HTMLElement).classList?.contains('t-emoji-button') ||
              (n as HTMLElement).classList?.contains('t-add-reaction-button'),
          )
      )
        return
      nextTick(() => {
        document.querySelector('emoji-picker')?.classList.toggle('dark', isSiteDark.value)
      })
    }
    el.addEventListener('click', onClick)
  },
  { once: true },
)

onMounted(() => {
  uiStore.setSidebarOpen(true)
})

onUnmounted(() => {
  themeObserver.disconnect()
  chatboxRef.value?.removeEventListener('click', onClick!)
})

function handleConversationId(event: { conversation?: { id: string } }) {
  const cId = event.conversation?.id
  if (cId) {
    userStore.setConversationId(cId)
    if (window.innerWidth < 640) {
      uiStore.setSidebarOpen(false)
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
      uiStore.setSidebarOpen(false)
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
        <AUserCard :name="userName" :photo-url="userPhoto" />
      </div>
    </template>

    <t-chatbox
      v-if="conversationId && userId && talkSession"
      :key="`${conversationId}_has_session`"
      ref="chatboxRef"
      :app-id="appId"
      :user-id="userId"
      :conversation-id="conversationId"
      :theme="isSiteDark ? 'default_dark' : 'default'"
    />
    <div v-else class="empty-chat-state">
      <div class="empty-graphic"><MessageCircle :size="70" /></div>
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
  align-items: center;
  color: @color-text;
  display: flex;
  font-size: @text-sm;
  height: @footer-height;

  .a-user-card {
    width: 100%;
  }
}

.sidebar-scroll-panel {
  flex: 1;
  overflow-y: auto;
}

.start-conversation {
  border-radius: 8px;
  border: 1px solid @color-border;
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
  height: calc(@full-height - @header-height - @footer-height);
  overflow-x: hidden;
  overflow-y: auto;
  padding: @spacing-s;
  width: 100%;
}

.user-row-trigger.a-button {
  background: transparent;
  border-radius: @border-radius-m;
  border: none;
  flex-shrink: 0;
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
  .background-and-text();
  border-color: @color-background;
  height: calc(@full-height - @header-height - @footer-height);
  width: 100%;

  &:deep(.t-conversation-list-content),
  &:deep(.t-theme-global-search-header),
  &:deep(.t-search-icon),
  &:deep(.t-theme-global-search-box),
  &:deep(.t-panel),
  &:deep(.t-loading-panel) {
    .background-and-text();
    border-color: @color-border;
  }

  &:deep(.t-conversation-name-link) {
    color: @color-baw;
  }

  &:deep(.t-theme-conversation-list-item[t-selected]) {
    background-color: @color-primary;

    &:deep(.t-conversation-name-link) {
      color: @color-white;
    }
  }

  &:deep(.t-theme-conversation-list-item) {
    border-color: @color-border;

    &:not([t-selected]) {
      .background-and-text();
    }
  }
}

t-chatbox {
  .background-and-text();
  border-color: @color-background;
  height: @full-height;
  width: 100%;

  &:deep(.t-theme-chat-header),
  &:deep(.t-participants),
  &:deep(.t-wrapper),
  &:deep(.t-preview),
  &:deep(.t-send-row),
  &:deep(.t-chatbox-content),
  &:deep(.t-theme-message-action-menu),
  &:deep(.t-theme-reply-bar),
  &:deep(.t-menu-item) {
    .background-and-text();
    border-color: @color-border;
  }

  &:deep(.t-theme-message .t-status-icon[t-status='everyoneRead'] svg) {
    fill: @color-primary;
  }

  &:deep(.t-theme-message[t-sender='currentUser'] .t-message-body),
  &:deep(.t-record-button),
  &:deep(.t-send-button) {
    border-color: @color-border;
    background-color: @color-primary;

    &:focus,
    &:hover {
      border-color: @color-primary-hover;
      background-color: @color-primary-hover;
    }
  }

  &:deep(.t-add-reaction-button),
  &:deep(.t-message-action-menu-button),
  &:deep(.t-close-button) {
    svg:hover {
      fill: @color-text;
    }
  }

  &:deep(.t-menu-item-box) {
    background: @color-background;
    border-radius: @border-radius-round;
  }
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
