<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { ImpersonateUserRow } from '@features/impersonate-user'
import { useUserStore } from '@entities/user/model/userStore'
import { Users, UsersRound } from '@lucide/vue'

const userStore = useUserStore()

const clients = computed(() => userStore.users)
const isLoading = computed(() => userStore.isLoading)
const errorMessage = computed(() => userStore.errorMessage)

onMounted(() => {
  userStore.fetchTalkJsUsers()
})

onUnmounted(() => {
  userStore.abortFetch()
})
</script>

<template>
  <section class="impersonate-user">
    <header class="panel-header">
      <div class="title-area">
        <div class="icon-shield"><UsersRound :size="20" /></div>
        <div class="text-group">
          <h3>Impersonate User</h3>
          <p class="subtitle">Select any user profile to start the chat.</p>
        </div>
      </div>
    </header>

    <div class="panel-body">
      <!-- 🟢 Simple Plain Text Loading Fallback Indicator Block -->
      <div v-if="isLoading && !clients.length" class="loading-fallback">
        <p>Loading profiles directory...</p>
      </div>

      <div v-else-if="errorMessage" class="error-panel-banner">
        <p>{{ errorMessage }}</p>
      </div>

      <div v-else-if="clients.length" class="impersonate-grid">
        <ImpersonateUserRow
          v-for="client of clients"
          :key="client.id"
          :id="client.id"
          :name="client.name"
          :photo-url="client.photoUrl"
        />
      </div>

      <div v-else class="empty-directory-fallback">
        <Users :size="40" class="fallback-icon" />
        <h4>Directory Channels Empty</h4>
        <p>No active client profiles were found synchronized in the hub database context maps.</p>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.mobile-mode(@rules) {
  @media (min-width: 640px) {
    @rules();
  }
}

.impersonate-user {
  display: flex;
  flex-direction: column;
  gap: @spacing-l;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: @spacing-l @spacing-m;
}

.panel-header {
  border-bottom: 1px solid @color-border;
  padding-bottom: @spacing-m;

  .title-area {
    display: flex;
    align-items: flex-start;
    gap: @spacing-m;
  }

  .icon-shield {
    color: @color-primary;
    background-color: fade(#42b883, 10%);
    width: 42px;
    height: 42px;
    border-radius: @border-radius-m;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h3 {
    color: @color-heading;
    font-size: @text-xl;
    font-weight: @weight-bold;
    margin: 0 0 4px 0;
  }

  .subtitle {
    color: @color-text;
    font-size: @text-sm;
    opacity: 0.8;
    margin: 0;
  }
}

.panel-body {
  width: 100%;
}

.loading-fallback {
  padding: @spacing-m;
  text-align: center;
  color: @color-text;
  font-size: @text-md;
  opacity: 0.7;
}

.impersonate-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: @spacing-m;

  .mobile-mode({
    grid-template-columns: repeat(2, 1fr);
  });

  .tablet-mode({
    grid-template-columns: repeat(3, 1fr);
  });

  .desktop-mode({
    grid-template-columns: repeat(4, 1fr);
  });
}

.error-panel-banner {
  padding: @spacing-m;
  background-color: fade(#ed3c50, 8%);
  border: 1px solid fade(#ed3c50, 20%);
  border-radius: @border-radius-m;
  color: @color-error;
  font-size: @text-sm;
  font-weight: @weight-medium;
}

.empty-directory-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: @spacing-xl @spacing-m;
  color: @color-text;

  .fallback-icon {
    margin-bottom: @spacing-m;
    opacity: 0.5;
    color: @color-disabled;
  }

  h4 {
    color: @color-heading;
    font-size: @text-md;
    font-weight: @weight-bold;
    margin-bottom: @spacing-xs;
  }

  p {
    max-width: 340px;
    font-size: @text-sm;
    line-height: @lh-normal;
    opacity: 0.8;
  }
}
</style>
