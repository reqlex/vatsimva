import type { H3Event } from 'h3'
import type { SessionData } from '~/types/auth'

const SESSION_COOKIE_NAME = 'vatsim_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSessionSecret(): string {
  const config = useRuntimeConfig()
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters')
  }
  return config.sessionSecret
}

async function signData(data: string): Promise<string> {
  const secret = getSessionSecret()
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return `${data}.${signatureBase64}`
}

async function verifyData(signedData: string): Promise<string | null> {
  const lastDotIndex = signedData.lastIndexOf('.')
  if (lastDotIndex === -1) return null

  const data = signedData.slice(0, lastDotIndex)
  const signature = signedData.slice(lastDotIndex + 1)

  const secret = getSessionSecret()
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const expectedBase64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  if (signature !== expectedBase64) return null
  return data
}

export async function setSession(event: H3Event, sessionData: SessionData): Promise<void> {
  const jsonData = JSON.stringify(sessionData)
  const base64Data = btoa(jsonData)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  const signedCookie = await signData(base64Data)

  setCookie(event, SESSION_COOKIE_NAME, signedCookie, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  })
}

export async function getSession(event: H3Event): Promise<SessionData | null> {
  const signedCookie = getCookie(event, SESSION_COOKIE_NAME)
  if (!signedCookie) return null

  const base64Data = await verifyData(signedCookie)
  if (!base64Data) return null

  try {
    // Restore base64 padding if needed
    let paddedBase64 = base64Data.replace(/-/g, '+').replace(/_/g, '/')
    while (paddedBase64.length % 4) {
      paddedBase64 += '='
    }
    const jsonData = atob(paddedBase64)
    const session = JSON.parse(jsonData) as SessionData

    // Check if session is expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export function clearSession(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/'
  })
}

export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function setState(event: H3Event, state: string): void {
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/'
  })
}

export function getState(event: H3Event): string | null {
  return getCookie(event, 'oauth_state') || null
}

export function clearState(event: H3Event): void {
  deleteCookie(event, 'oauth_state', {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/'
  })
}
