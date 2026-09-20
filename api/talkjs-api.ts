import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appId = process.env.VITE_APP_TALKJS_APP_ID
  const secretKey = process.env.VITE_APP_TALKJS_SECRET_KEY

  if (!appId || !secretKey) {
    return res
      .status(500)
      .json({ error: 'Missing TalkJS API configuration tokens on production server.' })
  }

  const wildcardPath = req.query.path
    ? `/${Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path}`
    : ''

  const targetUrl = `https://talkjs.com/${appId}${wildcardPath}`

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    }

    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      fetchOptions.body = JSON.stringify(req.body)
    }

    const talkJsResponse = await fetch(targetUrl, fetchOptions)

    if (!talkJsResponse.ok) {
      const errorText = await talkJsResponse.text()
      return res.status(talkJsResponse.status).send(errorText)
    }

    const data = await talkJsResponse.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Vercel serverless proxy crash:', error)
    return res.status(500).json({ error: 'Internal connection bridge failed to synchronize' })
  }
}
