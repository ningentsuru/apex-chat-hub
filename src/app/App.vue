<script setup lang="ts">
import { TheHeader, TheFooter } from '@widgets/general-layout'
</script>

<template>
  <TheHeader />
  <RouterView />
  <TheFooter />
</template>

<style lang="less" scoped>
main {
  min-height: @full-height;
}
</style>
