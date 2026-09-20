<script setup lang="ts" generic="T extends { id: string; name: string }">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { AInput } from '@shared/ui'

interface Props {
  options: T[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Select or search an option...',
  disabled: false,
  required: false,
  error: '',
  id: () => '',
})

const model = defineModel<T | null>({ default: null })

const searchQuery = ref(model.value ? model.value.name : '')
const isOpen = ref(false)
const comboboxRef = ref<HTMLDivElement | null>(null)

const filteredOptions = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query || model.value?.name === searchQuery.value) return props.options
  return props.options.filter((option) => option.name.toLowerCase().includes(query))
})

const selectOption = (option: T) => {
  model.value = option
  searchQuery.value = option.name
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (comboboxRef.value && !comboboxRef.value.contains(event.target as Node)) {
    isOpen.value = false
    searchQuery.value = model.value ? model.value.name : ''
  }
}

watch(model, (newModel) => {
  searchQuery.value = newModel ? newModel.name : ''
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="comboboxRef" class="a-combobox" :class="{ 'is-open': isOpen }">
    <AInput
      v-model="searchQuery"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :error="error"
      autocomplete="off"
      class="combobox-input-field"
      @focus="isOpen = true"
      @click="isOpen = true"
    />

    <transition name="dropdown-fade">
      <ul v-if="isOpen && !disabled" class="combobox-dropdown-panel">
        <li
          v-for="option in filteredOptions"
          :key="option.id"
          class="combobox-item"
          :class="{ 'is-selected': model?.id === option.id }"
          @click="selectOption(option)"
        >
          {{ option.name }}
        </li>

        <li v-if="filteredOptions.length === 0" class="combobox-empty">
          No matching options found
        </li>
      </ul>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.a-combobox {
  position: relative;
  width: 100%;
}

.combobox-input-field {
  :deep(.input-container)::after {
    content: '▼';
    position: absolute;
    right: @spacing-m;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: @color-text;
    opacity: 0.5;
    pointer-events: none;
    transition: transform 0.2s ease;
  }
}

.is-open {
  .combobox-input-field :deep(.input-container)::after {
    transform: translateY(-50%) rotate(180deg);
  }
}

.combobox-dropdown-panel {
  background-color: @color-background;
  border-radius: @border-radius-m;
  border: 1px solid @color-border;
  box-shadow: @shadow-md;
  height: 130px;
  left: 0;
  list-style: none;
  margin: 0;
  max-height: 220px;
  overflow-y: auto;
  padding: @spacing-xs;
  position: absolute;
  top: calc(100% + 4px);
  width: 100%;
  z-index: @z-index-dropdown;

  scrollbar-width: thin;
  scrollbar-color: @color-border transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    margin: @spacing-xs 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: @color-border;
    border-radius: @border-radius-round;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: @color-border-hover;
  }
}

.combobox-item {
  padding: @spacing-s @spacing-m;
  font-size: @text-md;
  color: @color-text;
  border-radius: @border-radius-s;
  cursor: pointer;
  transition: @transition-fast;
  user-select: none;

  &:hover {
    background-color: @color-background-soft;
    color: @color-heading;
  }

  &.is-selected {
    background-color: fade(#42b883, 12%);
    color: @color-primary;
    font-weight: @weight-bold;
  }
}

.combobox-empty {
  padding: @spacing-s @spacing-m;
  font-size: @text-sm;
  color: @color-disabled;
  font-style: italic;
  text-align: center;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
