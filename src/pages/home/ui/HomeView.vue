<script setup lang="ts">
import { ref } from 'vue'
import { ImpersonateUser } from '@features/impersonate-user'
import { AddUserModal } from '@features/add-user'
import { AButton } from '@shared/ui'

const isModalOpen = ref(false)
</script>

<template>
  <main class="home-view">
    <ImpersonateUser />

    <AButton class="sticky-btn" @click="isModalOpen = true">Add User +</AButton>

    <AddUserModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </main>
</template>

<style lang="less" scoped>
main {
  .main-flex(10px);
}

.sticky-btn {
  .background-and-text();
  bottom: 5vh;
  padding: 10px 20px;
  position: sticky;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    .background-and-text-soft();
  }
}
</style>
