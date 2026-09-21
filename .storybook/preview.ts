import type { Preview } from '@storybook/vue3-vite'
import '@/app/styles/main.less'

const customViewports = {
  sm: {
    name: 'Small Screen (sm)',
    styles: {
      width: '640px',
      height: '800px',
    },
  },
  md: {
    name: 'Medium Screen (md)',
    styles: {
      width: '768px',
      height: '800px',
    },
  },
  lg: {
    name: 'Large Screen (lg)',
    styles: {
      width: '1024px',
      height: '800px',
    },
  },
  xl: {
    name: 'Extra Large Screen (xg)',
    styles: {
      width: '1280px',
      height: '800px',
    },
  },
  '2xl': {
    name: 'Times 2 Extra Large Screen (xg)',
    styles: {
      width: '1536px',
      height: '800px',
    },
  },
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: customViewports,
    },
  },
}

export default preview
