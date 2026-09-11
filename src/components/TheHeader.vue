<script setup lang="ts"></script>

<template>
  <header>
    <RouterLink :to="{ name: 'home' }"> Apex Chat Hub </RouterLink>
  </header>
</template>

<style lang="less" scoped>
header {
  align-items: center;
  border-bottom: 1px solid @color-text;
  display: flex;
  height: @header-height;
  padding: 12px;
}
</style>
