<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { ImpersonateUserRow } from '@features/impersonate-user'
import { useUserStore } from '@entities/user/model/userStore'

const userStore = useUserStore()

const clients = computed(() => userStore.users)

onMounted(() => {
  userStore.fetchTalkJsUsers()
})

onUnmounted(() => {
  userStore.abortFetch()
})
</script>

<template>
  <section class="impersonate-user">
    <h3>Impersonate User</h3>
    <div class="impersonate-user-wrapper">
      <ImpersonateUserRow
        v-for="client of clients"
        :key="client.id"
        :id="client.id ?? ''"
        :name="client.name ?? ''"
        :photo-url="client.photoUrl ?? ' '"
      />
      <span v-if="!clients.length">Loading...</span>
    </div>
  </section>
</template>

<style lang="less" scoped>
.impersonate-user {
  display: flex;
  flex-direction: column;
  justify-self: end;
  width: 90%;
}

.impersonate-user-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  .mobile-mode({
    grid-template-columns: 1fr 1fr;
  });

  .tablet-mode({
    grid-template-columns: 1fr 1fr 1fr;
  });

  .desktop-mode({
    grid-template-columns: 1fr 1fr 1fr 1fr;
  });
}
</style>
