<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import defaultAvatarPath from '@/assets/test-image.jpg'

interface Props {
  id: string
  name: string
  photoUrl: string
}
const props = withDefaults(defineProps<Props>(), {
  id: '',
  name: '',
  photoUrl: '',
})

const userStore = useUserStore()
const router = useRouter()
const userId = computed(() => userStore.activeId)

function handleUserId() {
  userStore.setActiveId(props.id)
  router.push({ name: 'chat' })
}

function handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement

  if (imgElement.src !== defaultAvatarPath) {
    imgElement.src = defaultAvatarPath
  }
}
</script>

<template>
  <button
    class="impersonate-user-row"
    :class="{ active: userId === props.id }"
    @click="handleUserId"
  >
    <div class="client-avatar">
      <img :src="photoUrl" alt="Profile Picture" width="40" height="40" @error="handleImageError" />
    </div>
    <span>{{ props.name }}</span>
  </button>
</template>

<style lang="less" scoped>
.impersonate-user-row {
  .background-and-text();
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  gap: 10px;
  padding: 10px;

  &.active,
  &:hover {
    .background-and-text-invert();
  }
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #003366;
  background-size: cover;

  img {
    border-radius: 50%;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
}

.status {
  height: 10px;
  width: 10px;
  border: 1px solid @color-text;
  border-radius: 50%;
}

.online {
  background-color: green;
}
</style>
