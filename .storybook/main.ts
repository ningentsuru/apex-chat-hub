import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // addons: [
  //   '@storybook/addon-links',
  //   '@storybook/addon-essentials',
  //   '@storybook/addon-interactions',
  // ],
  framework: '@storybook/vue3-vite',
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@app': path.resolve(__dirname, '../src/app'),
        '@entities': path.resolve(__dirname, '../src/entities'),
        '@features': path.resolve(__dirname, '../src/features'),
        '@pages': path.resolve(__dirname, '../src/pages'),
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@widgets': path.resolve(__dirname, '../widgets'),
      }
    }
    return config
  },
}

export default config
