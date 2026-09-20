import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appId = process.env.VITE_APP_TALKJS_APP_ID?.trim() || ''
  const secretKey = process.env.VITE_APP_TALKJS_SECRET_KEY?.trim() || ''

  if (!appId || appId === 'undefined' || !secretKey || secretKey === 'undefined') {
    return res.status(500).json({
      error: 'Missing TalkJS API configuration tokens on production server.',
      debug: { hasAppId: !!appId, hasSecretKey: !!secretKey },
    })
  }

  const cleanPath = (req.url || '')
    .split('?')[0]
    .replace(/^\/api\/talkjs-api/, '')
    .replace(/^\/talkjs-api/, '')

  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  const targetUrl = `https://api.talkjs.com/v1/${appId}${formattedPath}`

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method || '')
        ? typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body)
        : undefined,
    }

    const talkJsResponse = await fetch(targetUrl, fetchOptions)
    const responseText = await talkJsResponse.text()

    if (!talkJsResponse.ok) {
      return res.status(talkJsResponse.status).send(responseText)
    }

    const isJson = talkJsResponse.headers.get('content-type')?.includes('application/json')
    return res.status(200).send(isJson ? JSON.parse(responseText) : responseText)
  } catch (error) {
    console.error('Vercel serverless proxy crash:', error)
    return res.status(502).json({ error: 'Host lookup resolution failed', attemptedUrl: targetUrl })
  }
}
