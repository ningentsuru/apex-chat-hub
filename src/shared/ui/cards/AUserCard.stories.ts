import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AUserCard from './AUserCard.vue'
const meta: Meta<typeof AUserCard> = {
  title: 'Components/AUserCard',
  component: AUserCard,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the user displayed on the card',
    },
    photoUrl: {
      control: 'text',
      description:
        'URL of the user profile image. Falls back to default asset on empty or load error.',
    },
    isActive: {
      control: 'boolean',
      description: 'Toggles active highlighting and styles',
    },
  },
  args: {
    name: 'Jane Doe',
    photoUrl: 'https://unsplash.com',
    isActive: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = {
  args: {
    isActive: true,
  },
}

export const LongNameTruncation: Story = {
  args: {
    name: 'Alexander Maximilian Hubertus von Liechtenstein the Third',
  },
}

export const FallbackAvatar: Story = {
  args: {
    photoUrl: '',
  },
}

export const BrokenImageLink: Story = {
  args: {
    photoUrl: 'https://invalid-url-that-will-fail-to-load.com',
  },
}
