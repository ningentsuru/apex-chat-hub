<script setup lang="ts">
import { computed } from 'vue'

const year = computed(() => new Date().getFullYear())

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/ningentsuru/apex-chat-hub',
    iconPath: '/github.svg',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/joshua-alexis-sardido',
    iconPath: '/linkedin.svg',
  },
]
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <span class="copyright-text">© {{ year }} All rights reserved.</span>

      <nav class="social-nav" aria-label="Social Links Menu Directory">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link-item"
          :aria-label="`Visit our ${link.name} profile layout screen`"
        >
          <img
            :src="link.iconPath"
            :alt="`${link.name} Icon symbol`"
            class="social-icon-img"
            width="20"
            height="20"
          />
        </a>
      </nav>
    </div>
  </footer>
</template>

<style lang="less" scoped>
.app-footer {
  display: flex;
  align-items: center;
  height: @footer-height;
  padding: 0 @spacing-m;
  border-top: 1px solid @color-border;
  background-color: @color-background;
  transition: @transition-color;
  width: 100%;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.copyright-text {
  font-size: @text-sm;
  color: @color-text;
  opacity: 0.8;
  font-weight: @weight-normal;
  user-select: none;
}

.social-nav {
  display: flex;
  align-items: center;
  gap: @spacing-s;
}

.social-link-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: @border-radius-m;
  transition: @transition-fast;
  padding: 0;

  &:hover {
    background-color: @color-background-soft;
    transform: translateY(-1px);
  }
}

.social-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  transition: @transition-fast;
  opacity: 0.7;
  background: white;
  border-radius: 2px;

  :deep(html.dark) & {
    filter: invert(1) brightness(2);
  }

  .social-link-item:hover & {
    opacity: 1;
    color: @color-primary;
  }
}
</style>
