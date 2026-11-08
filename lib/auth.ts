import 'server-only'
import { cookies } from 'next/headers'
import crypto from 'crypto'

/**
 * Very small session layer for the backoffice.
 *
 * Credentials default to the requested user/pass but can be overridden via
 * env vars (ADMIN_USER / ADMIN_PASSWORD) in production on cPanel.
 * The session cookie holds an HMAC signed token so it can't be forged.
 */

const COOKIE_NAME = 'bo_session'
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours

function adminUser(): string {
  return process.env.ADMIN_USER || 'yoter'
}
function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || '123'
}
function secret(): string {
  return process.env.SESSION_SECRET || 'avi-tours-dev-secret-change-me'
}

function sign(value: string): string {
  const hmac = crypto.createHmac('sha256', secret()).update(value).digest('hex')
  return `${value}.${hmac}`
}

function verify(token: string): boolean {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const value = token.slice(0, idx)
  const expected = sign(value)
  // constant-time compare
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function checkCredentials(user: string, password: string): boolean {
  return user === adminUser() && password === adminPassword()
}

export async function createSession(): Promise<void> {
  const token = sign(`admin:${Date.now()}`)
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return Boolean(token && verify(token))
}
