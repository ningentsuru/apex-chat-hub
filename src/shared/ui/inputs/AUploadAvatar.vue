<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  label?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Profile Picture',
  id: () => `avatar-upload-${Math.random().toString(36).substring(2, 9)}`,
})

const model = defineModel<string>({ default: '' })
const imagePreview = ref<string | null>(null)

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = URL.createObjectURL(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const MAX_SIZE = 56
        canvas.width = MAX_SIZE
        canvas.height = MAX_SIZE

        if (ctx) {
          ctx.drawImage(img, 0, 0, MAX_SIZE, MAX_SIZE)

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4)

          model.value = compressedBase64
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    document.getElementById(props.id)?.click()
  }
}
</script>

<template>
  <div class="a-upload-avatar">
    <span class="upload-label">{{ label }}</span>
    <div class="upload-wrapper">
      <input
        :id="id"
        type="file"
        accept="image/*"
        class="hidden-input"
        @change="handleImageUpload"
      />

      <label
        :for="id"
        class="custom-upload-btn"
        tabindex="0"
        role="button"
        @keydown="handleKeyPress"
      >
        Choose Image
      </label>

      <div v-if="imagePreview" class="preview-container">
        <img :src="imagePreview" alt="Upload Preview" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.a-upload-avatar {
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
}
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
  outline: none;
  &:focus-visible {
    border-color: @color-primary;
    background-color: @color-background;
    box-shadow: 0 0 0 3px fade(#42b883, 15%);
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
</style>
