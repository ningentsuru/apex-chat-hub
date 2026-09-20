<script setup lang="ts">
interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <!-- Backdrop Shadow Overlay -->
      <div v-if="isOpen" class="a-modal-overlay" @click.self="emit('close')">
        <!-- The Floating Window Frame Container -->
        <div class="a-modal-card" role="dialog" aria-modal="true">
          <!-- Header Area Slot Wrapper -->
          <header class="a-modal-header">
            <div class="header-title">
              <slot name="header">
                <h3>Default Title</h3>
              </slot>
            </div>

            <button class="close-icon-btn" @click="emit('close')" aria-label="Close modal">
              &times;
            </button>
          </header>

          <!-- Core Modal Content Body Slot -->
          <div class="a-modal-body">
            <slot></slot>
          </div>

          <!-- Footer Control Action Slot Wrapper (Optional context mapping) -->
          <footer v-if="$slots.footer" class="a-modal-footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="less" scoped>
.a-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: @z-index-modal;
  backdrop-filter: blur(4px);
}

.a-modal-card {
  .background-and-text();
  width: 100%;
  max-width: 480px;
  border-radius: @border-radius-l;
  box-shadow: @shadow-lg;
  border: 1px solid @color-border;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: @spacing-m;
}

.a-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @spacing-m @spacing-l;
  border-bottom: 1px solid @color-border;
  background-color: @color-background-soft;

  .header-title {
    color: @color-heading;
    font-size: @text-lg;
    font-weight: @weight-bold;

    :deep(h1),
    :deep(h2),
    :deep(h3) {
      margin: 0;
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
    }
  }
}

.close-icon-btn {
  background: transparent;
  border: none;
  font-size: @text-2xl;
  line-height: 1;
  color: @color-text;
  opacity: 0.6;
  cursor: pointer;
  transition: @transition-fast;
  padding: @spacing-xs;
  border-radius: @border-radius-s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;

  &:hover {
    opacity: 1;
    background-color: @color-background-mute;
  }
}

.a-modal-body {
  padding: @spacing-l;
  overflow-y: auto;
  max-height: calc(80vh - @header-height);
}

.a-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: @spacing-s;
  padding: @spacing-m @spacing-l;
  border-top: 1px solid @color-border;
  background-color: @color-background-soft;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  .a-modal-card {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  .a-modal-card {
    transform: scale(0.96) translateY(6px);
  }
}
</style>
