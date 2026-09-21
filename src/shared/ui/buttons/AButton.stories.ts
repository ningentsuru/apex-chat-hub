import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AButton from './AButton.vue'

const meta: Meta<typeof AButton> = {
  title: 'Components/AButton',
  component: AButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'accent', 'outline', 'text', 'ghost', 'destructive'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'The native HTML button type attribute',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables user interaction with the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and disables interaction',
    },
    default: {
      control: 'text',
      description: 'The content inside the button slot',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
    default: 'Button Text',
  },
  render: (args) => ({
    components: { AButton },
    setup() {
      return { args }
    },
    template: `
      <AButton v-bind="args">
        {{ args.default }}
      </AButton>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
