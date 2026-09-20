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
  height: @full-height;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.mobile-toggle {
  background-color: @color-background-soft !important;
  border-radius: @border-radius-m;
  border: 1px solid @color-border !important;
  box-shadow: @shadow-sm;
  height: 40px;
  left: @spacing-s;
  padding: 0 !important;
  position: absolute;
  top: @spacing-s;
  width: 40px;
  z-index: calc(@z-index-nav + 20);

  .mobile-mode({
    display: none;
  });
}

.canvas-sidebar {
  background-color: @color-background;
  border-right: 1px solid @color-border;
  height: 100%;
  left: 0;
  padding-top: 56px;
  position: absolute;
  top: 0;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  z-index: @z-index-nav;

  .mobile-mode({
    min-width: 240px;
    padding-top: 0;
    position: relative;
    transform: translateX(0);
    width: 20%;
  });
}

.canvas-workspace {
  background-color: @color-background-soft;
  height: 100%;
  left: 0;
  padding-top: 56px;
  position: absolute;
  top: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  .mobile-mode({
    flex: 1;
    padding-top: 0;
    position: relative;
    transform: translateX(0);
    width: auto;
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
