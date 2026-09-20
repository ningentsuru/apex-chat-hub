<script setup lang="ts">
import defaultAvatarPath from '@shared/assets/test-image.jpg'

interface Props {
  name: string
  photoUrl?: string
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  name: '',
  photoUrl: '',
  isActive: false,
})

function handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement
  if (imgElement.src !== defaultAvatarPath) {
    imgElement.src = defaultAvatarPath
  }
}
</script>

<template>
  <div class="a-user-card" :class="{ 'is-active': isActive }">
    <!-- Avatar Shield Container -->
    <div class="client-avatar">
      <img
        :src="photoUrl || defaultAvatarPath"
        :alt="`${name}'s profile`"
        width="40"
        height="40"
        @error="handleImageError"
      />
    </div>

    <!-- User Meta Metadata Label -->
    <span class="client-name">{{ name }}</span>
  </div>
</template>

<style lang="less" scoped>
.a-user-card {
  align-items: center;
  background-color: @color-background !important;
  border-radius: @border-radius-m;
  border: 1px solid @color-border !important;
  color: @color-text !important;
  display: flex !important;
  font-size: @text-md;
  font-weight: @weight-medium;
  gap: @spacing-s;
  justify-content: flex-start !important;
  padding: @spacing-s @spacing-m !important;
  pointer-events: none;
  text-align: left;
  transition: @transition-fast;
  width: 100%;

  &.is-active {
    background-color: fade(#42b883, 12%) !important;
    border-color: fade(#42b883, 30%) !important;
    color: @color-primary !important;
    font-weight: @weight-bold;
  }
}

.client-avatar {
  background-color: @color-background-mute;
  border-radius: @border-radius-round;
  border: 1px solid @color-border;
  flex-shrink: 0;
  height: 40px;
  overflow: hidden;
  width: 40px;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
}

.client-name {
  .text-truncate();
  color: inherit;
}
</style>
