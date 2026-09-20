import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { getTalkSession } from '@talkjs/core'
import { UserSchema } from './types'
import type { User, TalkJsSession, CreateUserPayload, TargetUserPayload } from './types'

export const useUserStore = defineStore('user', () => {
  const appId = import.meta.env.VITE_APP_TALKJS_APP_ID as string
  let abortController: AbortController | null = null

  const activeId = ref<string>('')
  const users = ref<User[]>([])
  const conversationId = ref<string>('')

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)

  const session = shallowRef<TalkJsSession | null>(null)

  function setActiveId(id: string) {
    activeId.value = id
    conversationId.value = ''

    if (id && id.trim() !== '' && appId) {
      session.value = getTalkSession({
        appId: appId,
        userId: id,
      })
    } else {
      session.value = null
    }
  }

  function setUsers(data: User[]) {
    users.value = data
  }

  function setConversationId(id: string) {
    conversationId.value = id
  }

  /**
   * Fetches full member directory and maps profiles safely via Zod validations
   */
  async function fetchTalkJsUsers() {
    try {
      isLoading.value = true
      errorMessage.value = null

      if (abortController) {
        abortController.abort()
      }
      abortController = new AbortController()

      const response = await fetch(`/talkjs-api/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`TalkJS API Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      users.value = result.data.map((rawUser: unknown) => {
        const parseResult = UserSchema.safeParse(rawUser)

        if (!parseResult.success) {
          console.warn(
            'Patched structural schema anomaly in user data record:',
            parseResult.error.format(),
          )

          const raw = rawUser as Record<string, unknown>
          return {
            id: String(raw.id || `gen_${Math.random().toString(36).substring(2, 7)}`),
            name: String(raw.name || 'Anonymous User'),
            email: String(raw.email || ''),
            photoUrl: String(raw.photoUrl || 'https://placehold.co'),
          }
        }

        const parsed = parseResult.data
        return {
          id: parsed.id || `fallback_${Math.random().toString(36).substring(2, 7)}`,
          name: parsed.name || 'Anonymous User',
          email: parsed.email || '',
          photoUrl: parsed.photoUrl || 'https://placehold.co',
        }
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      errorMessage.value =
        error instanceof Error ? error.message : 'An unknown network error occurred'
      console.error('Failed to sync TalkJS users:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Disposes background Abort Controllers safely on layout lifecycle unmount flags
   */
  function abortFetch() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  /**
   * Dispatches generation commands down to database layers and hooks models locally
   */
  async function createUser(payload: CreateUserPayload) {
    try {
      isLoading.value = true
      errorMessage.value = null

      const response = await fetch(`/talkjs-api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `user_${Math.random().toString(36).substring(2, 9)}`,
          name: payload.name,
          email: payload.email,
          photoUrl: payload.photoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      const newUser: User = {
        id: result.data.id || result.data.customId,
        name: result.data.name,
        email: result.data.email || '',
        photoUrl: result.data.photoUrl || 'https://placehold.co',
      }

      users.value.push(newUser)
      return newUser
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Failed to save user information'
      console.error(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verifies member mappings against SDK channels and initializes private sync windows
   */
  async function startConversationWithUser(targetUser: TargetUserPayload) {
    if (!activeId.value || !session.value) return

    const participants = [activeId.value, targetUser.id].sort()
    const customConversationId = `chat_${participants[0]}_${participants[1]}`

    try {
      isLoading.value = true

      await session.value.currentUser.createIfNotExists({
        name: activeId.value,
      })

      await session.value.user(targetUser.id).createIfNotExists({
        name: targetUser.name || targetUser.id,
      })

      const conversation = session.value.conversation(customConversationId)
      await conversation.createIfNotExists()
      await conversation.participant(targetUser.id).createIfNotExists()

      conversationId.value = customConversationId
      return customConversationId
    } catch (error) {
      console.error('Failed to initialize TalkJS conversation room:', error)
      errorMessage.value = 'Failed to open message channel structure'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeId,
    users,
    conversationId,
    isLoading,
    errorMessage,
    appId,
    session,
    setActiveId,
    setUsers,
    setConversationId,
    fetchTalkJsUsers,
    abortFetch,
    createUser,
    startConversationWithUser,
  }
})
