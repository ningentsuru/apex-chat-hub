<script setup lang="ts">
import { ref } from 'vue'
import { ImpersonateUser } from '@features/impersonate-user'
import { AddUserModal, DeactivateUserModal } from '@/features/manage-user'
import { AButton } from '@shared/ui'

const isAddModalOpen = ref(false)
const isDeactivateModalOpen = ref(false)
</script>

<template>
  <main class="home-view">
    <ImpersonateUser />

    <div class="sticky-btn">
      <AButton @click="isAddModalOpen = true">Add User</AButton>
      <AButton variant="destructive" @click="isDeactivateModalOpen = true">Deactivate User</AButton>
    </div>

    <AddUserModal :is-open="isAddModalOpen" @close="isAddModalOpen = false" />
    <DeactivateUserModal :is-open="isDeactivateModalOpen" @close="isDeactivateModalOpen = false" />
  </main>
</template>

<style lang="less" scoped>
main {
  .main-flex(10px);
  overflow-y: auto;
}

.sticky-btn {
  .background-and-text();
  border-radius: 16px;
  border: 1px solid @color-border;
  bottom: 5vh;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 20px;
  position: sticky;
}
</style>
