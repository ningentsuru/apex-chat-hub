import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appId = (process.env.VITE_APP_TALKJS_APP_ID || '').trim()
  const secretKey = (process.env.VITE_APP_TALKJS_SECRET_KEY || '').trim()

  if (!appId || appId === 'undefined' || !secretKey || secretKey === 'undefined') {
    return res.status(500).json({
      error: 'Missing TalkJS API configuration tokens on production server.',
      debug: { hasAppId: !!appId, hasSecretKey: !!secretKey },
    })
  }

  const rawUrl = req.url || ''

  const urlWithoutQuery = rawUrl.split('?')[0]
  let cleanPath = urlWithoutQuery.replace(/^\/api\/talkjs-api/, '').replace(/^\/talkjs-api/, '')

  if (cleanPath && !cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`
  }

  const targetUrl = `https://api.talkjs.com/v1/${appId}${cleanPath}`

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    }

    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    }

    const talkJsResponse = await fetch(targetUrl, fetchOptions)

    if (!talkJsResponse.ok) {
      const errorText = await talkJsResponse.text()
      return res.status(talkJsResponse.status).send(errorText)
    }

    const contentType = talkJsResponse.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await talkJsResponse.json()
      return res.status(200).json(data)
    } else {
      const textData = await talkJsResponse.text()
      return res.status(200).send(textData)
    }
  } catch (error) {
    console.error('Vercel serverless proxy crash:', error)
    return res.status(502).json({
      error: 'Host lookup resolution failed',
      attemptedUrl: targetUrl,
    })
  }
}
