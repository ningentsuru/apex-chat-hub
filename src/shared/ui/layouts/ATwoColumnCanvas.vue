<script lang="ts" setup>
import { Menu, X } from '@lucide/vue'
import { AButton } from '@shared/ui'

const isOpen = defineModel<boolean>('open', { default: false })
</script>

<template>
  <div class="a-two-column-canvas" :class="{ 'is-sidebar-open': isOpen }">
    <AButton
      variant="ghost"
      class="mobile-toggle"
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? 'Close layout sidebar panel' : 'Open layout sidebar panel'"
    >
      <X v-if="isOpen" height="20" width="20" />
      <Menu v-else height="20" width="20" />
    </AButton>

    <aside class="canvas-sidebar">
      <slot name="sidebar" />
    </aside>

    <main class="canvas-workspace">
      <slot />
    </main>
  </div>
</template>

<style lang="less" scoped>
.a-two-column-canvas {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.mobile-toggle {
  position: absolute;
  top: @spacing-s;
  left: @spacing-s;
  z-index: calc(@z-index-nav + 20);
  width: 40px;
  height: 40px;
  padding: 0 !important;
  border-radius: @border-radius-m;
  box-shadow: @shadow-sm;
  background-color: @color-background-soft !important;
  border: 1px solid @color-border !important;

  .mobile-mode({
    display: none;
  });
}

.canvas-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding-top: 56px;
  z-index: @z-index-nav;
  background-color: @color-background;
  border-right: 1px solid @color-border;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .mobile-mode({
    position: relative;
    transform: translateX(0);
    width: 20%;
    min-width: 240px;
    padding-top: 0;
  });
}

.canvas-workspace {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 56px;
  background-color: @color-background-soft;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .mobile-mode({
    position: relative;
    width: auto;
    flex: 1;
    padding-top: 0;
    transform: translateX(0) !important;
  });
}

.is-sidebar-open {
  .canvas-sidebar {
    transform: translateX(0);
  }
  .canvas-workspace {
    transform: translateX(100%);

    .mobile-mode({
      transform: translateX(0) !important;
    });
  }
}
</style>
