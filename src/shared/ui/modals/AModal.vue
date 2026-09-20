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
      <div v-if="isOpen" class="a-modal-overlay" @click.self="emit('close')">
        <div class="a-modal-card" role="dialog" aria-modal="true">
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

          <div class="a-modal-body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="a-modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="less" scoped>
.a-modal-overlay {
  align-items: center;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  height: 100dvh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100dvw;
  z-index: @z-index-modal;
}

.a-modal-card {
  .background-and-text();
  border-radius: @border-radius-l;
  border: 1px solid @color-border;
  box-shadow: @shadow-lg;
  display: flex;
  flex-direction: column;
  margin: @spacing-m;
  max-width: 480px;
  overflow: visible;
  width: 100%;
}

.a-modal-header {
  align-items: center;
  background-color: @color-background-soft;
  border-bottom: 1px solid @color-border;
  border-radius: @border-radius-l;
  display: flex;
  justify-content: space-between;
  padding: @spacing-m @spacing-l;

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
  align-items: center;
  background: transparent;
  border-radius: @border-radius-s;
  border: none;
  color: @color-text;
  cursor: pointer;
  display: inline-flex;
  font-size: @text-2xl;
  height: 28px;
  justify-content: center;
  line-height: 1;
  opacity: 0.6;
  padding: @spacing-xs;
  transition: @transition-fast;
  width: 28px;

  &:hover {
    background-color: @color-background-mute;
    opacity: 1;
  }
}

.a-modal-body {
  max-height: calc(80vh - @header-height);
  overflow-x: visible;
  overflow-y: visible;
  padding: @spacing-l;
}

.a-modal-footer {
  background-color: @color-background-soft;
  border-radius: @border-radius-l;
  border-top: 1px solid @color-border;
  display: flex;
  gap: @spacing-s;
  justify-content: flex-end;
  padding: @spacing-m @spacing-l;
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
