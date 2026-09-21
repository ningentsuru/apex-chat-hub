import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ACombobox from './ACombobox.vue'

interface MockOption {
  id: string
  name: string
}

interface ComboboxStoryArgs {
  label: string
  placeholder: string
  disabled: boolean
  required: boolean
  error: string
  options: MockOption[]
}

const mockOptions: MockOption[] = [
  { id: '1', name: 'Vue.js' },
  { id: '2', name: 'React' },
  { id: '3', name: 'Angular' },
  { id: '4', name: 'Svelte' },
  { id: '5', name: 'Solid' },
  { id: '6', name: 'Qwik' },
]

const meta: Meta<ComboboxStoryArgs> = {
  title: 'Components/ACombobox',
  component: ACombobox as unknown as Record<keyof typeof ACombobox, unknown>,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Label text for the input' },
    placeholder: { control: 'text', description: 'Input field placeholder text' },
    disabled: { control: 'boolean', description: 'Locks down user interactions' },
    required: { control: 'boolean', description: 'Highlights input requirements' },
    error: { control: 'text', description: 'Validation error text fallback' },
    options: { control: 'object', description: 'Array of generic option objects' },
  },
  args: {
    label: 'Frontend Frameworks',
    placeholder: 'Select or search an option...',
    disabled: false,
    required: false,
    error: '',
    options: mockOptions,
  },
  render: (args) => ({
    components: { ACombobox },
    setup() {
      const selectedModel = ref<MockOption | null>(null)
      return { args, selectedModel }
    },
    template: `
      <div style="min-height: 260px; max-width: 400px;">
        <ACombobox v-bind="args" v-model="selectedModel" />
        <div style="margin-top: 20px; font-size: 13px; color: #666;">
          <strong>Bound Output:</strong> {{ selectedModel ? selectedModel : 'None' }}
        </div>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<ComboboxStoryArgs>

export const Default: Story = {}

export const Preselected: Story = {
  render: (args) => ({
    components: { ACombobox },
    setup() {
      const selectedModel = ref<MockOption | null>(mockOptions[0] ?? null)
      return { args, selectedModel }
    },
    template: `
      <div style="min-height: 260px; max-width: 400px;">
        <ACombobox v-bind="args" v-model="selectedModel" />
      </div>
    `,
  }),
}

export const Required: Story = {
  args: {
    required: true,
  },
}

export const ValidationError: Story = {
  args: {
    error: 'Please choose an engine framework to proceed.',
  },
}

export const DisabledState: Story = {
  args: {
    disabled: true,
    label: 'Disabled Input Grid',
  },
}

export const EmptyDataset: Story = {
  args: {
    options: [],
    placeholder: 'No libraries currently available...',
  },
}
