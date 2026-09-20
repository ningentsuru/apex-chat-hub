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
    <div class="client-avatar">
      <img
        :src="photoUrl || defaultAvatarPath"
        :alt="`${name}'s profile`"
        width="40"
        height="40"
        @error="handleImageError"
      />
    </div>

    <span class="client-name">{{ name }}</span>
  </div>
</template>

<style lang="less" scoped>
.a-user-card {
  align-items: center;
  background-color: @color-background;
  border-radius: @border-radius-m;
  border: 1px solid @color-border;
  color: @color-text;
  display: flex;
  font-size: @text-md;
  font-weight: @weight-medium;
  gap: @spacing-s;
  justify-content: flex-start;
  padding: @spacing-s @spacing-m;
  pointer-events: none;
  text-align: left;
  transition: @transition-fast;
  width: 100%;

  &.is-active {
    background-color: fade(#42b883, 12%);
    border-color: fade(#42b883, 30%);
    color: @color-primary;
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
