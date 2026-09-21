import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '@entities/ui/model/uiStore'
import ATwoColumnCanvas from './ATwoColumnCanvas.vue'

interface CanvasStoryArgs {
  default?: string
  sidebar?: string
  isSidebarOpenInitialState: boolean
}

const meta: Meta<CanvasStoryArgs> = {
  title: 'Layouts/ATwoColumnCanvas',
  component: ATwoColumnCanvas as unknown as Record<keyof typeof ATwoColumnCanvas, unknown>,
  tags: ['autodocs'],
  argTypes: {
    default: { control: 'text', description: 'Main content workspace slot' },
    sidebar: { control: 'text', description: 'Sidebar container slot' },
    isSidebarOpenInitialState: {
      control: 'boolean',
      description: 'Mock initial Pinia state toggle',
    },
  },
  args: {
    default: 'Main Workspace Display Panel (Active Panel Viewport Context)',
    sidebar: 'Sidebar Navigation Control Framework (Drawer Controls)',
    isSidebarOpenInitialState: false,
  },
  decorators: [
    (story, context) => {
      const pinia = createPinia()
      setActivePinia(pinia)

      const uiStore = useUiStore()
      uiStore.isSidebarOpen = context.args.isSidebarOpenInitialState

      return story()
    },
  ],
  render: (args) => ({
    components: { ATwoColumnCanvas },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 500px; width: 100%; border: 1px solid #ccc; position: relative;">
        <ATwoColumnCanvas>
          <template #sidebar>
            <div style="padding: 16px; background-color: #f1f5f9; height: 100%; box-sizing: border-box;">
              {{ args.sidebar }}
            </div>
          </template>
          <div style="padding: 16px; height: 100%; box-sizing: border-box;">
            {{ args.default }}
          </div>
        </ATwoColumnCanvas>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<CanvasStoryArgs>

export const DefaultDesktop: Story = {
  args: {
    isSidebarOpenInitialState: false,
  },
}

export const SidebarClosedMobile: Story = {
  args: {
    isSidebarOpenInitialState: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'sm',
    },
  },
}

export const SidebarOpenMobile: Story = {
  args: {
    isSidebarOpenInitialState: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'sm',
    },
  },
}
