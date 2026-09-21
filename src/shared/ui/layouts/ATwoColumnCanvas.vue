<script lang="ts" setup>
import { useUiStore } from '@entities/ui/model/uiStore'

const uiStore = useUiStore()
</script>

<template>
  <div class="a-two-column-canvas" :class="{ 'is-sidebar-open': uiStore.isSidebarOpen }">
    <aside class="canvas-sidebar">
      <slot name="sidebar"></slot>
    </aside>

    <main class="canvas-workspace">
      <slot></slot>
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

.canvas-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
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
  });
}

.canvas-workspace {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: @color-background-soft;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .mobile-mode({
    position: relative;
    width: auto;
    flex: 1;
    transform: translateX(0);
  });
}

.is-sidebar-open {
  .canvas-sidebar {
    transform: translateX(0);
  }
  .canvas-workspace {
    transform: translateX(100%);

    .mobile-mode({
      transform: translateX(0);
    });
  }
}
</style>
