<script setup lang="ts">
import { ref } from 'vue'
import { AButton, AInput, AModal, AUploadAvatar } from '@shared/ui'
import { useUserStore } from '@entities/user/model/userStore'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const userStore = useUserStore()

const name = ref('')
const email = ref('')
const photoUrl = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!name.value || !email.value) return
  isSubmitting.value = true

  try {
    await userStore.createUser({
      name: name.value,
      email: email.value,
      photoUrl: photoUrl.value,
    })

    resetForm()
  } catch (error) {
    console.error('Modal submission blocked:', error)
  } finally {
    isSubmitting.value = false
    userStore.fetchTalkJsUsers()
    resetForm()
  }
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  photoUrl.value = ''
  emit('close')
}
</script>

<template>
  <AModal :is-open="isOpen" @close="resetForm">
    <template #header>
      <h3>Add New User</h3>
    </template>

    <form id="add-user-form" @submit.prevent="handleSubmit" class="modal-form-layout">
      <AInput v-model="name" label="Full Name" placeholder="e.g. Sarah Jenkins" required />

      <AInput
        v-model="email"
        type="email"
        label="Email Address"
        placeholder="e.g. sarah.j@apexinvest.com"
        required
      />

      <AUploadAvatar v-model="photoUrl" label="Profile Picture" />
    </form>

    <template #footer>
      <AButton variant="outline" @click="resetForm">Cancel</AButton>
      <AButton type="submit" form="add-user-form" variant="primary" :loading="isSubmitting">
        Save User
      </AButton>
    </template>
  </AModal>
</template>

<style lang="less" scoped>
.modal-form-layout {
  display: flex;
  flex-direction: column;
  gap: @spacing-m;
}
</style>
