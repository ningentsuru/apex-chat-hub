import type { ProxyOptions } from 'vite'

export function getTalkJsProxyConfig(env: Record<string, string>): Record<string, ProxyOptions> {
  const appId = env.VITE_APP_TALKJS_APP_ID
  const secretKey = env.VITE_APP_TALKJS_SECRET_KEY

  return {
    '/talkjs-api': {
      target: 'https://api.talkjs.com',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => {
        const cleanPath = path.replace(/^\/talkjs-api/, '')
        return `/v1/${appId}${cleanPath}`
      },
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          if (secretKey) {
            proxyReq.setHeader('Authorization', `Bearer ${secretKey}`)
          }
        })
      },
    },
  }
}
