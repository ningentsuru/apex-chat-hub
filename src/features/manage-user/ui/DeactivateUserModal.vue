<script setup lang="ts">
import { ref, computed } from 'vue'
import { AButton, AModal, ACombobox } from '@shared/ui'
import { useUserStore } from '@entities/user/model/userStore'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const userStore = useUserStore()

type User = (typeof userStore.users)[number]

const selectedUser = ref<User | null>(null)
const isSubmitting = ref(false)

const userList = computed(() => userStore.users)

async function handleSubmit() {
  isSubmitting.value = true

  try {
    if (!selectedUser.value) return

    await userStore.deactivateUser(selectedUser.value.id)

    emit('close')
  } catch (error) {
    console.error('Modal submission blocked:', error)
  } finally {
    isSubmitting.value = false
    userStore.fetchTalkJsUsers()
  }
}

function handleResetForm() {
  selectedUser.value = null
  emit('close')
}
</script>

<template>
  <AModal :is-open="isOpen" @close="emit('close')">
    <template #header>
      <h3>Deactivate User</h3>
    </template>

    <form id="add-user-form" @submit.prevent="handleSubmit" class="modal-form-layout">
      <ACombobox
        v-model="selectedUser"
        :options="userList"
        label="Search Channels Directory"
        placeholder="Type name to lookup profiles..."
      />
    </form>

    <template #footer>
      <AButton variant="outline" @click="handleResetForm">Cancel</AButton>
      <AButton type="submit" form="add-user-form" variant="destructive" :loading="isSubmitting">
        Deactivate User
      </AButton>
    </template>
  </AModal>
</template>

<style lang="less" scoped>
.modal-form-layout {
  display: flex;
  flex-direction: column;
  gap: @spacing-m;
  height: max-content;
  overflow: unset;
}
</style>
