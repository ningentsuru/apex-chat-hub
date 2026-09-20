<script setup lang="ts">
import { ref } from 'vue'
import { AButton, AInput, AModal } from '@shared/ui'
import { useUserStore } from '@entities/user/model/userStore'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const userStore = useUserStore()

const name = ref('')
const email = ref('')
const photoUrl = ref('')
const imagePreview = ref<string | null>(null)
const isSubmitting = ref(false)

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }

    imagePreview.value = URL.createObjectURL(file)
    photoUrl.value = imagePreview.value
  }
}

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
  }
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  photoUrl.value = ''

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = null

  emit('close')
}
</script>

<template>
  <AModal :is-open="isOpen" @close="resetForm">
    <!-- 1. Header Slot Block -->
    <template #header>
      <h3>Add New Client</h3>
    </template>

    <!-- 2. Main Body Content (Default Slot) -->
    <form id="add-user-form" @submit.prevent="handleSubmit" class="modal-form-layout">
      <AInput v-model="name" label="Full Name" placeholder="e.g. Sarah Jenkins" required />

      <AInput
        v-model="email"
        type="email"
        label="Email Address"
        placeholder="e.g. sarah.j@apexinvest.com"
        required
      />

      <!-- Restored Image Upload Infrastructure -->
      <div class="form-group">
        <span class="upload-label">Profile Picture</span>
        <div class="upload-wrapper">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleImageUpload"
          />
          <label for="file-upload" class="custom-upload-btn"> Choose Image </label>
          <div v-if="imagePreview" class="preview-container">
            <img :src="imagePreview" alt="Upload Preview" />
          </div>
        </div>
      </div>
    </form>

    <!-- 3. Footer Action Control Slot Block -->
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
}

.upload-label {
  font-size: @text-sm;
  font-weight: @weight-medium;
  color: @color-heading;
}

.upload-wrapper {
  display: flex;
  align-items: center;
  gap: @spacing-m;

  .hidden-input {
    display: none;
  }

  .custom-upload-btn {
    padding: @spacing-s @spacing-m;
    background-color: @color-background-soft;
    border: 1px solid @color-border;
    border-radius: @border-radius-m;
    cursor: pointer;
    font-size: @text-sm;
    font-weight: @weight-medium;
    color: @color-text;
    transition: @transition-fast;
    user-select: none;

    &:hover {
      background-color: @color-background-mute;
      border-color: @color-border-hover;
    }
  }

  .preview-container {
    width: 48px;
    height: 48px;
    border-radius: @border-radius-round;
    overflow: hidden;
    border: 1px solid @color-border;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
