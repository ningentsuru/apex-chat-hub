<script setup lang="ts">
type ButtonVariant = 'primary' | 'accent' | 'outline' | 'text' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="a-button"
    :class="[`is-${variant}`, `is-${size}`, { 'is-loading': loading }]"
  >
    <span v-if="loading" class="spinner" aria-hidden="true"></span>

    <span class="button-content" :class="{ 'is-hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style lang="less" scoped>
.a-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: @weight-medium;
  border: 1px solid transparent;
  border-radius: @border-radius-m;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;
  transition: @transition-fast;
  position: relative;
  overflow: hidden;

  &:disabled {
    cursor: not-allowed;
    background-color: @color-bg-disabled !important;
    border-color: transparent !important;
    color: @color-disabled !important;
    box-shadow: none !important;
  }

  &.is-sm {
    padding: @spacing-xs @spacing-s;
    font-size: @text-sm;
    border-radius: @border-radius-s;
  }
  &.is-md {
    padding: @spacing-s @spacing-m;
    font-size: @text-md;
  }
  &.is-lg {
    padding: @spacing-m @spacing-xl;
    font-size: @text-lg;
  }

  &.is-primary {
    background-color: @color-primary;
    color: var(--vt-c-white);

    &:hover:not(:disabled) {
      background-color: darken(#42b883, 8%);
      box-shadow: @shadow-sm;
    }
  }

  &.is-accent {
    background-color: @color-accent;
    color: var(--vt-c-white);

    &:hover:not(:disabled) {
      background-color: darken(#646cff, 8%);
      box-shadow: @shadow-sm;
    }
  }

  &.is-outline {
    background-color: transparent;
    border-color: @color-border;
    color: @color-text;

    &:hover:not(:disabled) {
      border-color: @color-border-hover;
      background-color: @color-background-soft;
    }
  }

  &.is-text {
    background-color: transparent;
    color: @color-primary;

    &:hover:not(:disabled) {
      background-color: fade(#42b883, 10%);
    }
  }

  &.is-ghost {
    background-color: transparent;
    color: @color-text;

    &:hover:not(:disabled) {
      background-color: @color-background-mute;
    }
  }
}

.button-content {
  width: 100%;
}

.button-content.is-hidden {
  opacity: 0;
}

.spinner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: @border-radius-round;
  animation: button-spin 0.75s linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
