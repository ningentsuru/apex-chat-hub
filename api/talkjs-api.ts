import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appId = (process.env.VITE_APP_TALKJS_APP_ID || '').trim()
  const secretKey = (process.env.VITE_APP_TALKJS_SECRET_KEY || '').trim()

  if (!appId || appId === 'undefined' || !secretKey || secretKey === 'undefined') {
    return res.status(500).json({
      error: 'Missing or corrupt TalkJS API tokens inside Vercel environment configurations.',
      debug: { hasAppId: !!appId, hasSecretKey: !!secretKey },
    })
  }

  const wildcardPath = req.query.path
    ? `/${Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path}`
    : ''

  const targetUrl = `https://api.talkjs.com/v1/${appId}${wildcardPath}`

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
    return res.status(502).json({ error: 'Internal connection bridge failed to synchronize' })
  }
}
