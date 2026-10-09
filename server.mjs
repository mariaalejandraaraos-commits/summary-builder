import { createHash, randomBytes } from 'node:crypto'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.join(projectRoot, 'dist')

try {
  for (const line of readFileSync(path.join(projectRoot, '.env'), 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
} catch {
  // El archivo .env es opcional hasta que se configure la aplicación OAuth de Figma.
}

const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '127.0.0.1'
const sessions = new Map()
const previews = new Map()

function readCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').map((value) => value.trim()).filter(Boolean).map((value) => {
    const separator = value.indexOf('=')
    return [value.slice(0, separator), decodeURIComponent(value.slice(separator + 1))]
  }))
}

function send(response, status, body, headers = {}) {
  response.writeHead(status, { 'Cache-Control': 'no-store', ...headers })
  response.end(body)
}

function sendJson(response, status, body) {
  send(response, status, JSON.stringify(body), { 'Content-Type': 'application/json; charset=utf-8' })
}

function cookieFor(sessionId, secure) {
  return `summary_builder_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${secure ? '; Secure' : ''}`
}

function configFor(request) {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || `localhost:${port}`}`)
  const configuredRedirect = process.env.FIGMA_OAUTH_REDIRECT_URI
  const redirectUri = configuredRedirect || `${requestUrl.protocol}//${requestUrl.host}/api/figma/callback`
  return {
    clientId: process.env.FIGMA_OAUTH_CLIENT_ID || '',
    clientSecret: process.env.FIGMA_OAUTH_CLIENT_SECRET || '',
    redirectUri,
    secureCookie: redirectUri.startsWith('https://'),
  }
}

function configured(config) {
  return Boolean(config.clientId && config.clientSecret && config.redirectUri)
}

function sessionFor(request, response, secureCookie) {
  const existingId = readCookies(request).summary_builder_session
  if (existingId && sessions.has(existingId)) return [existingId, sessions.get(existingId)]

  const id = randomBytes(32).toString('base64url')
  const session = { createdAt: Date.now() }
  sessions.set(id, session)
  response.setHeader('Set-Cookie', cookieFor(id, secureCookie))
  return [id, session]
}

function makeCodeChallenge(verifier) {
  return createHash('sha256').update(verifier).digest('base64url')
}

function safeReturnTo(value) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/'
}

function parseFigmaReference(value) {
  try {
    const figmaUrl = new URL(value)
    if (figmaUrl.protocol !== 'https:' || !['figma.com', 'www.figma.com'].includes(figmaUrl.hostname)) return null
    const [, rawType, fileKey] = figmaUrl.pathname.split('/')
    const type = rawType === 'file' ? 'design' : rawType
    const nodeId = figmaUrl.searchParams.get('node-id')?.replace('-', ':')
    if (type !== 'design' || !/^[a-zA-Z0-9]+$/.test(fileKey || '') || !nodeId || !/^\d+:\d+$/.test(nodeId)) return null
    return { fileKey, nodeId }
  } catch {
    return null
  }
}

async function exchangeToken(config, body) {
  const response = await fetch('https://api.figma.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  })
  if (!response.ok) throw new Error('Figma rechazó la autorización.')
  return response.json()
}

async function accessTokenFor(config, session) {
  if (session.accessToken && session.expiresAt > Date.now() + 60_000) return session.accessToken
  if (!session.refreshToken) return null

  const response = await fetch('https://api.figma.com/v1/oauth/refresh', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ refresh_token: session.refreshToken }),
  })
  if (!response.ok) throw new Error('Figma rechazó la renovación de la conexión.')
  const token = await response.json()
  session.accessToken = token.access_token
  session.expiresAt = Date.now() + Number(token.expires_in || 0) * 1000
  return session.accessToken
}

async function handleFigma(request, response, requestUrl) {
  const config = configFor(request)
  const pathName = requestUrl.pathname

  if (pathName === '/api/figma/status') {
    const session = sessions.get(readCookies(request).summary_builder_session)
    sendJson(response, 200, { configured: configured(config), connected: Boolean(session?.refreshToken || (session?.accessToken && session.expiresAt > Date.now())) })
    return
  }

  if (pathName === '/api/figma/connect') {
    if (!configured(config)) {
      sendJson(response, 503, { error: 'Falta configurar la conexión de Figma para este Builder.' })
      return
    }
    const [, session] = sessionFor(request, response, config.secureCookie)
    const state = randomBytes(32).toString('base64url')
    const codeVerifier = randomBytes(48).toString('base64url')
    session.oauth = { state, codeVerifier, returnTo: safeReturnTo(requestUrl.searchParams.get('returnTo')), expiresAt: Date.now() + 10 * 60 * 1000 }
    const authorizeUrl = new URL('https://www.figma.com/oauth')
    authorizeUrl.searchParams.set('client_id', config.clientId)
    authorizeUrl.searchParams.set('redirect_uri', config.redirectUri)
    authorizeUrl.searchParams.set('scope', 'file_content:read')
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('response_type', 'code')
    authorizeUrl.searchParams.set('code_challenge', makeCodeChallenge(codeVerifier))
    authorizeUrl.searchParams.set('code_challenge_method', 'S256')
    response.writeHead(302, { Location: authorizeUrl.toString() })
    response.end()
    return
  }

  if (pathName === '/api/figma/callback') {
    const session = sessions.get(readCookies(request).summary_builder_session)
    const code = requestUrl.searchParams.get('code')
    const state = requestUrl.searchParams.get('state')
    if (!configured(config) || !session?.oauth || !code || state !== session.oauth.state || session.oauth.expiresAt < Date.now()) {
      send(response, 400, '<h1>No pudimos conectar Figma</h1><p>Vuelve al Builder e intenta de nuevo.</p>', { 'Content-Type': 'text/html; charset=utf-8' })
      return
    }
    try {
      const token = await exchangeToken(config, {
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        code_verifier: session.oauth.codeVerifier,
      })
      session.accessToken = token.access_token
      session.refreshToken = token.refresh_token
      session.expiresAt = Date.now() + Number(token.expires_in || 0) * 1000
      const returnTo = session.oauth.returnTo
      delete session.oauth
      response.writeHead(302, { Location: returnTo })
      response.end()
    } catch {
      send(response, 502, '<h1>No pudimos conectar Figma</h1><p>Revisa la configuración de la aplicación e intenta de nuevo.</p>', { 'Content-Type': 'text/html; charset=utf-8' })
    }
    return
  }

  if (pathName === '/api/figma/preview') {
    const sessionId = readCookies(request).summary_builder_session
    const session = sessions.get(sessionId)
    const figmaReference = parseFigmaReference(requestUrl.searchParams.get('url') || '')
    if (!session || !figmaReference) {
      sendJson(response, 400, { error: 'El enlace debe seleccionar un frame de un archivo de diseño de Figma.' })
      return
    }
    try {
      const accessToken = await accessTokenFor(config, session)
      if (!accessToken) {
        sendJson(response, 401, { error: 'Conecta Figma para generar la preview.' })
        return
      }
      const cacheKey = `${sessionId}:${figmaReference.fileKey}:${figmaReference.nodeId}`
      const cached = previews.get(cacheKey)
      if (cached?.expiresAt > Date.now()) {
        send(response, 200, cached.image, { 'Content-Type': cached.contentType, 'Cache-Control': 'private, max-age=300' })
        return
      }
      const imageRequest = new URL(`https://api.figma.com/v1/images/${figmaReference.fileKey}`)
      imageRequest.searchParams.set('ids', figmaReference.nodeId)
      imageRequest.searchParams.set('format', 'png')
      imageRequest.searchParams.set('scale', '1')
      const imageResponse = await fetch(imageRequest, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (!imageResponse.ok) throw new Error('No pudimos pedir la imagen a Figma.')
      const imagePayload = await imageResponse.json()
      const imageUrl = imagePayload.images?.[figmaReference.nodeId]
      if (!imageUrl) throw new Error('Figma no pudo renderizar este frame.')
      const binaryResponse = await fetch(imageUrl)
      if (!binaryResponse.ok) throw new Error('No pudimos descargar la imagen de Figma.')
      const image = Buffer.from(await binaryResponse.arrayBuffer())
      const contentType = binaryResponse.headers.get('content-type') || 'image/png'
      previews.set(cacheKey, { image, contentType, expiresAt: Date.now() + 5 * 60 * 1000 })
      send(response, 200, image, { 'Content-Type': contentType, 'Cache-Control': 'private, max-age=300' })
    } catch {
      sendJson(response, 502, { error: 'No pudimos generar la preview. Revisa el acceso al archivo y el enlace de Figma.' })
    }
    return
  }

  sendJson(response, 404, { error: 'Ruta de Figma no encontrada.' })
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

async function serveStatic(response, pathname) {
  const decodedPath = decodeURIComponent(pathname === '/' ? '/index.html' : pathname)
  const filePath = path.resolve(distDirectory, `.${decodedPath}`)
  if (!filePath.startsWith(`${distDirectory}${path.sep}`)) {
    send(response, 403, 'No disponible')
    return
  }
  try {
    const file = await readFile(filePath)
    send(response, 200, file, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=3600' })
  } catch {
    if (!path.extname(filePath)) return serveStatic(response, '/index.html')
    send(response, 404, 'No encontrado')
  }
}

createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || `localhost:${port}`}`)
  if (requestUrl.pathname.startsWith('/api/figma/')) {
    void handleFigma(request, response, requestUrl)
    return
  }
  void serveStatic(response, requestUrl.pathname)
}).listen(port, host, () => {
  console.log(`Summary Builder disponible en http://${host}:${port}`)
})
