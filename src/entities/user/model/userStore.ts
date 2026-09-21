import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { getTalkSession } from '@talkjs/core'
import { UserSchema } from './types'
import type { User, TalkJsSession, CreateUserPayload, TargetUserPayload } from './types'

export const useUserStore = defineStore('user', () => {
  const appId = import.meta.env.VITE_APP_TALKJS_APP_ID as string
  let abortController: AbortController | null = null

  const activeId = ref<string>('')
  const users = shallowRef<User[]>([])
  const conversationId = ref<string>('')

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)

  const session = shallowRef<TalkJsSession | null>(null)

  const activeUser = computed(
    () => users.value.find((item) => item.id === activeId.value)?.name || '',
  )

  const activePhoto = computed(
    () => users.value.find((item) => item.id === activeId.value)?.photoUrl || '',
  )

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
   * Disposes background Abort Controllers safely on layout lifecycle unmount flags
   */
  function abortFetch() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
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

      setUsers(
        result.data
          .filter((item: { name: string }) => item.name !== 'Account Deactivated')
          .map((rawUser: unknown) => {
            const parsed = UserSchema.safeParse(rawUser).data

            return {
              id: parsed?.id || '',
              name: parsed?.name || '',
              photoUrl: parsed?.photoUrl || '',
            }
          }),
      )
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
   * Dispatches generation commands down to database layers and hooks models locally
   */
  async function createUser(payload: CreateUserPayload) {
    try {
      isLoading.value = true
      errorMessage.value = null

      const clientUuid = `client_${crypto.randomUUID()}`

      const response = await fetch(`/talkjs-api/users/${clientUuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: [payload.email],
          photoUrl: payload.photoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status} ${response.statusText}`)
      }

      const newUser: User = {
        id: clientUuid,
        name: payload.name,
        email: payload.email,
        photoUrl: payload.photoUrl || '',
      }

      users.value.unshift(newUser)
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

      await Promise.all([
        session.value.currentUser.createIfNotExists({
          name: activeId.value,
        }),
        session.value.user(targetUser.id).createIfNotExists({
          name: targetUser.name || targetUser.id,
        }),
      ])

      const conversation = session.value.conversation(customConversationId)

      await Promise.all([
        conversation.createIfNotExists(),
        conversation.participant(targetUser.id).createIfNotExists(),
      ])

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

  /**
   * Overwrites an existing user's data on TalkJS to anonymize them,
   * then removes them from the local cache application screen.
   */
  async function deactivateUser(targetUserId: string) {
    try {
      isLoading.value = true
      errorMessage.value = null

      const response = await fetch(`/talkjs-api/users/${targetUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Account Deactivated',
          email: [],
          photoUrl: null,
          role: 'deactivated',
        }),
      })

      if (!response.ok) {
        throw new Error(`TalkJS Deactivation Failure: ${response.status} ${response.statusText}`)
      }

      users.value = users.value.filter((user) => user.id !== targetUserId)

      if (activeId.value === targetUserId) {
        setActiveId('')
      }
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Failed to deactivate member profile'
      console.error(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeId,
    activeUser,
    activePhoto,
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
    deactivateUser,
  }
})
