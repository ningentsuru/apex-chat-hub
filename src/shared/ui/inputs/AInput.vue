<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  placeholder?: string
  label?: string
  id?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  label: '',
  id: () => `a-input-${Math.random().toString(36).substring(2, 9)}`,
  error: '',
  disabled: false,
  required: false,
})

const model = defineModel<string | number>({ default: '' })

const hasLabel = computed(() => !!props.label)
const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="a-input-wrapper" :class="{ 'is-disabled': disabled, 'has-error': hasError }">
    <label v-if="hasLabel" :for="id" class="a-input-label">
      {{ label }}
      <span v-if="required" class="required-asterisk" aria-hidden="true">*</span>
    </label>

    <div class="input-container">
      <input
        :id="id"
        :type="type"
        v-model="model"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="hasError ? `${id}-error` : undefined"
        class="a-input-field"
      />
    </div>

    <!-- Live Regional Error Text Content Display -->
    <transition name="fade-slide">
      <span v-if="hasError" :id="`${id}-error`" class="a-input-error-text" role="alert">
        {{ error }}
      </span>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.a-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
  width: 100%;
  font-family: inherit;
}

.a-input-label {
  font-size: @text-sm;
  font-weight: @weight-medium;
  color: @color-heading;
  user-select: none;

  .required-asterisk {
    color: @color-error;
    margin-left: 2px;
  }
}

.input-container {
  position: relative;
  width: 100%;
}

.a-input-field {
  width: 100%;
  font-size: @text-md;
  line-height: @lh-tight;
  padding: @spacing-s @spacing-m;
  color: @color-text;
  background-color: @color-background-soft;
  border: 1px solid @color-border;
  border-radius: @border-radius-m;
  outline: none;
  transition: @transition-fast;

  &::placeholder {
    color: @color-disabled;
    opacity: 0.8;
  }

  &:focus {
    border-color: @color-primary;
    background-color: @color-background;
    box-shadow: 0 0 0 3px fade(#42b883, 15%);
  }

  &:hover:not(:focus):not(:disabled) {
    border-color: @color-border-hover;
  }
}

.is-disabled {
  .a-input-label {
    color: @color-disabled;
  }
  .a-input-field {
    cursor: not-allowed;
    background-color: @color-bg-disabled;
    border-color: transparent;
    color: @color-disabled;

    &::placeholder {
      color: fade(#bdbdbd, 50%);
    }
  }
}

.has-error {
  .a-input-label {
    color: @color-error;
  }
  .a-input-field {
    border-color: @color-error;

    &:focus {
      box-shadow: 0 0 0 3px fade(#ed3c50, 15%);
    }
  }
}

.a-input-error-text {
  font-size: @text-sm;
  font-weight: @weight-medium;
  color: @color-error;
  margin-top: 2px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
