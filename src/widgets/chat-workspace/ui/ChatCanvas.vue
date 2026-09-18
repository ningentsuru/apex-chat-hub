<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/entities/user/model/userStore'
import { getTalkSession } from '@talkjs/core'

import '@talkjs/web-components'
import '@talkjs/web-components/default.css'

const userStore = useUserStore()
const appId = import.meta.env.VITE_APP_TALKJS_APP_ID as string

const userId = computed<string | undefined>(() => userStore.activeId)
const conversationId = computed<string | undefined>(() => userStore.conversationId)
const excludeCurrentUser = computed(() =>
  userStore.users.filter((user) => user.id !== userId.value),
)

const activeTab = ref<'start' | 'current'>('start')

const session = ref<ReturnType<typeof getTalkSession> | null>(null)

function handleConversationId(event: { conversation?: { id: string } }) {
  const conversationId = event.conversation?.id
  if (conversationId) {
    userStore.setConversationId(conversationId)
  }
}

async function startConversationWithUser(targetUser: { id?: string; name?: string }) {
  if (!userId.value || !session.value || !targetUser.id) return

  const participants = [userId.value, targetUser.id].sort()
  const customConversationId = `chat_${participants[0]}_${participants[1]}`

  try {
    await session.value.currentUser.createIfNotExists({
      name: userId.value,
    })

    await session.value.user(targetUser.id).createIfNotExists({
      name: targetUser.name || targetUser.id,
    })

    const conversation = session.value.conversation(customConversationId)
    await conversation.createIfNotExists()

    await conversation.participant(targetUser.id).createIfNotExists()

    userStore.setConversationId(customConversationId)
    activeTab.value = 'current'
  } catch (error) {
    console.error('Failed to initialize TalkJS conversation:', error)
  }
}

watch(
  userId,
  (newId) => {
    if (newId && appId) {
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
    <div class="tabs-wrapper">
      <div class="tabs-header">
        <button :class="{ active: activeTab === 'start' }" @click="activeTab = 'start'">
          Start Conversation
        </button>
        <button :class="{ active: activeTab === 'current' }" @click="activeTab = 'current'">
          Current Conversation
        </button>
      </div>

      <div v-if="activeTab === 'start'" class="start-conversation">
        <div
          v-for="user in excludeCurrentUser"
          :key="user.id"
          class="user-tab"
          @click="startConversationWithUser(user)"
        >
          {{ user.name || user.id }}
        </div>
      </div>

      <KeepAlive>
        <t-conversation-list
          v-if="activeTab === 'current' && userId"
          :key="userId"
          :app-id="appId"
          :user-id="userId"
          @select-conversation="handleConversationId"
        />
      </KeepAlive>
    </div>

    <!-- FIX 2: Changed :key to conversationId to force a clean component remount when switching chats -->
    <t-chatbox
      v-if="conversationId"
      :key="conversationId"
      :app-id="appId"
      :user-id="userId"
      :conversation-id="conversationId"
    />
  </section>
</template>

<style lang="less" scoped>
.chat-canvas {
  display: flex;
}
.tabs-wrapper {
  width: 20%;
  display: flex;
  flex-direction: column;
}
.tabs-header {
  display: flex;
  border-bottom: 1px solid #ccc;
  height: @header-height;
  button {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: @color-text;
    font-size: 16px;
    &.active {
      font-weight: bold;
      border-bottom: 2px solid #000;
    }
  }
}
.start-conversation {
  width: 100%;
}
t-conversation-list {
  height: calc(@full-height - @header-height);
  width: 100%;
}
t-chatbox {
  height: @full-height;
  width: 80%;
}

.user-tab {
  cursor: pointer;
  padding: 8px;
}
</style>
