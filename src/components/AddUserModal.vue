<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { name: string; email: string; photoUrl: string }): void
}>()

// 1. Reactive Form State
const name = ref('')
const email = ref('')
const photoUrl = ref('')
const imagePreview = ref<string | null>(null)
const isSubmitting = ref(false)

// 2. Handle File Upload Interception
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Create a local object URL for instant UI preview feedback
    imagePreview.value = URL.createObjectURL(file)

    // NOTE: In production, upload this to your cloud storage bucket (e.g., S3)
    // For now, we fall back to a placeholder or the preview string
    photoUrl.value = imagePreview.value
  }
}

// 3. Form Submission Handler
const handleSubmit = async () => {
  if (!name.value || !email.value) return

  isSubmitting.value = true

  try {
    emit('submit', {
      name: name.value,
      email: email.value,
      photoUrl: photoUrl.value || 'https://placehold.co',
    })

    // Reset state on successful addition
    resetForm()
  } catch (error) {
    console.error('Failed to create user:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  photoUrl.value = ''
  imagePreview.value = null
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="props.isOpen" class="add-user-modal modal-overlay" @click.self="emit('close')">
        <div class="modal-card">
          <header class="modal-header">
            <h3>Add New Client</h3>
            <button class="close-btn" @click="emit('close')">&times;</button>
          </header>

          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="form-group">
              <label for="client-name">Full Name</label>
              <input
                id="client-name"
                v-model="name"
                type="text"
                placeholder="e.g. Sarah Jenkins"
                required
              />
            </div>

            <div class="form-group">
              <label for="client-email">Email Address</label>
              <input
                id="client-email"
                v-model="email"
                type="email"
                placeholder="e.g. sarah.j@apexinvest.com"
                required
              />
            </div>

            <div class="form-group">
              <label>Profile Picture</label>
              <div class="upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  id="file-upload"
                  class="hidden-input"
                />
                <label for="file-upload" class="custom-upload-btn"> Choose Image </label>
                <div v-if="imagePreview" class="preview-container">
                  <img :src="imagePreview" alt="Upload Preview" />
                </div>
              </div>
            </div>

            <footer class="modal-actions">
              <button type="button" class="btn-secondary" @click="emit('close')">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Creating...' : 'Save User' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="less" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 450px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    color: #003366; // Global primary color token
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #9ca3af;
    &:hover {
      color: #374151;
    }
  }
}

.modal-form {
  padding: 20px;

  .form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    input[type='text'],
    input[type='email'] {
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      &:focus {
        outline: none;
        border-color: #003366;
      }
    }
  }
}

.upload-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;

  .hidden-input {
    display: none;
  }

  .custom-upload-btn {
    padding: 8px 14px;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    &:hover {
      background-color: #e5e7eb;
    }
  }

  .preview-container {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;

  button {
    padding: 10px 18px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .btn-secondary {
    background: none;
    border: 1px solid #d1d5db;
    color: #4b5563;
    &:hover {
      background-color: #f9fafb;
    }
  }

  .btn-primary {
    background-color: #003366;
    border: none;
    color: #ffffff;
    &:hover {
      background-color: #002244;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

/* Modal Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
