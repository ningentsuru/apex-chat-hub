import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((env) => {
  const baseConfig = typeof viteConfig === 'function' ? viteConfig(env) : viteConfig

  return mergeConfig(baseConfig, {
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
})
