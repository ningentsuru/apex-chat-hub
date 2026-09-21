import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import AModal from './AModal.vue'

const meta: Meta<typeof AModal> = {
  title: 'Components/AModal',
  component: AModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility state of the modal component dialog layer',
    },
    header: {
      control: 'text',
      description: 'Named slot content for customizing the modal header section',
    },
    default: {
      control: 'text',
      description: 'The primary fallback modal layout body context configuration slot',
    },
    footer: {
      control: 'text',
      description: 'Optional named slot layout container for CTA operations or actions',
    },
  },
  args: {
    isOpen: true,
    header: 'System Confirmation Window',
    default: 'Are you absolutely sure you want to permanently execute this processing task?',
    footer: 'Cancel Action Dismiss',
  },
  parameters: {
    teleport: 'body',
  },
  render: (args) => ({
    components: { AModal },
    setup() {
      const isVisible = ref(args.isOpen)

      const handleClose = () => {
        isVisible.value = false
      }

      const handleReset = () => {
        isVisible.value = true
      }

      return { args, isVisible, handleClose, handleReset }
    },
    template: `
      <div>
        <div style="padding: 20px; text-align: center;">
          <button
            style="padding: 10px 16px; border-radius: 6px; cursor: pointer; border: 1px solid #ccc; font-weight: 500;"
            @click="handleReset"
          >
            Trigger Modal Display Window
          </button>
        </div>

        <AModal :isOpen="isVisible" @close="handleClose">
          <template #header>
            <h3>{{ args.header }}</h3>
          </template>

          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
            {{ args.default }}
          </p>

          <template v-if="args.footer" #footer>
            <button
              style="padding: 8px 14px; border-radius: 6px; cursor: pointer; border: 1px solid #ddd; background: transparent; font-size: 13px;"
              @click="handleClose"
            >
              {{ args.footer }}
            </button>
            <button
              style="padding: 8px 14px; border-radius: 6px; cursor: pointer; border: none; background: #42b883; color: white; font-weight: 600; font-size: 13px;"
              @click="handleClose"
            >
              Confirm Execution
            </button>
          </template>
        </AModal>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const StandardModal: Story = {}

export const NoFooterActions: Story = {
  args: {
    header: 'Information Advisory',
    default: 'Changes have been indexed on the backup cloud nodes successfully.',
    footer: '',
  },
}

export const LongScrollingBody: Story = {
  args: {
    header: 'End User Terms of Service Agreement',
    default:
      'This structural text string is duplicated across rows to test window constraint tracking boundaries. '.repeat(
        15,
      ),
  },
}
