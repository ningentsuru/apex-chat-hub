<script setup lang="ts">
import { computed } from 'vue'

const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer>
    <span>© {{ year }} Joshua Alexis Natividad Sardido. All rights reserved.</span>
  </footer>
</template>

<style lang="less" scoped>
footer {
  align-items: end;
  border-top: 1px solid @color-text;
  display: flex;
  height: @footer-height;
  justify-content: end;
  padding: 12px;
}
</style>
