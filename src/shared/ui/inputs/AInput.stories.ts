import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import AInput from './AInput.vue'

const meta: Meta<typeof AInput> = {
  title: 'Components/AInput',
  component: AInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'The native HTML input type attribute',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when the input is empty',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input element',
    },
    id: {
      control: 'text',
      description: 'The distinct element ID mapping for input binding and ARIA references',
    },
    error: {
      control: 'text',
      description: 'Validation message error string',
    },
    disabled: {
      control: 'boolean',
      description: 'Toggles structural active interaction status',
    },
    required: {
      control: 'boolean',
      description: 'Displays a required asterisk marker on the label context',
    },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text here...',
    label: 'Username',
    error: '',
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { AInput },
    setup() {
      const textModel = ref<string | number>('')
      return { args, textModel }
    },
    template: `
      <div style="max-width: 400px;">
        <AInput v-bind="args" v-model="textModel" />
        <div style="margin-top: 16px; font-size: 13px; color: #666;">
          <strong>Live Input Value:</strong> {{ textModel === '' ? 'Empty' : textModel }}
        </div>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: {
    required: true,
  },
}

export const ValidationError: Story = {
  args: {
    error: 'This account username is already taken.',
  },
}

export const DisabledState: Story = {
  args: {
    disabled: true,
    placeholder: 'Cannot modify profile entries',
  },
}

export const PasswordType: Story = {
  args: {
    type: 'password',
    label: 'Secure Pin',
    placeholder: '••••••••',
  },
}

export const NumberType: Story = {
  args: {
    type: 'number',
    label: 'Age Input Field',
    placeholder: '25',
  },
}

export const NoLabel: Story = {
  args: {
    label: '',
    placeholder: 'Standalone search field...',
  },
}
