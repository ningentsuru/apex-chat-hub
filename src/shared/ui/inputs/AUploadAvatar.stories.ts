import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import AUploadAvatar from './AUploadAvatar.vue'

const meta: Meta<typeof AUploadAvatar> = {
  title: 'Components/AUploadAvatar',
  component: AUploadAvatar,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The description label text displayed above the upload wrapper',
    },
    id: {
      control: 'text',
      description: 'The native elements unique string binding for labels and keyboard tracking',
    },
  },
  args: {
    label: 'Profile Picture',
  },
  // Setting up a rendering structure to display the raw compressed Base64 string value updated via defineModel
  render: (args) => ({
    components: { AUploadAvatar },
    setup() {
      const base64Model = ref<string>('')
      return { args, base64Model }
    },
    template: `
      <div style="max-width: 500px;">
        <AUploadAvatar v-bind="args" v-model="base64Model" />

        <div style="margin-top: 24px; padding: 12px; background: #f8f9fa; border: 1px dashed #ccc; border-radius: 6px;">
          <div style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 4px;">
            v-model Base64 String Output (Max 56x56 compressed):
          </div>
          <textarea
            readonly
            style="width: 100%; height: 80px; font-family: monospace; font-size: 11px; padding: 6px; border: 1px solid #ddd; background: #fff; resize: none;"
            :value="base64Model || 'No image uploaded yet. Click \\'Choose Image\\' above to generate base64 data...'"
          />
        </div>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Core Stories ---

export const Default: Story = {}

export const CustomLabel: Story = {
  args: {
    label: 'Upload Company Logo',
  },
}
