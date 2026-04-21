import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import Store from 'electron-store'
import { getPrisma } from '../db/client'
import type { AuthResult, SessionResult } from '../../shared/types'

const store = new Store<{
  sessionToken: string
  userId: string
}>({
  encryptionKey: process.env.STORE_ENCRYPTION_KEY,
  name: 'auth',
})

type AuthApp = ReturnType<typeof betterAuth>

let authInstance: AuthApp | null = null

function getAuth(): AuthApp {
  if (!authInstance) {
    authInstance = betterAuth({
      database: prismaAdapter(getPrisma(), { provider: 'sqlite' }),
      emailAndPassword: { enabled: true },
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: 'http://localhost',
      trustedOrigins: ['http://localhost'],
    }) as AuthApp
  }
  return authInstance
}

function extractSessionToken(headers: Headers): string | null {
  const cookie = headers.get('set-cookie') ?? ''
  const match = cookie.match(/better-auth\.session_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  try {
    const auth = getAuth()
    const req = new Request('http://localhost/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost' },
      body: JSON.stringify({ email, password, name: email }),
    })
    const res = await auth.handler(req)
    const data = await res.json() as { user?: { id: string; email: string; name: string | null; createdAt: string }; message?: string }
    if (res.ok && data.user) {
      const token = extractSessionToken(res.headers)
      if (token) {
        store.set('sessionToken', token)
        store.set('userId', data.user.id)
      }
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          createdAt: new Date(data.user.createdAt),
        },
      }
    }
    return { success: false, error: data.message ?? 'Sign up failed' }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const auth = getAuth()
    const req = new Request('http://localhost/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost' },
      body: JSON.stringify({ email, password }),
    })
    const res = await auth.handler(req)
    const data = await res.json() as { user?: { id: string; email: string; name: string | null; createdAt: string }; message?: string }
    if (res.ok && data.user) {
      const token = extractSessionToken(res.headers)
      if (token) {
        store.set('sessionToken', token)
        store.set('userId', data.user.id)
      }
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          createdAt: new Date(data.user.createdAt),
        },
      }
    }
    return { success: false, error: data.message ?? 'Sign in failed' }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function signOut(): Promise<void> {
  try {
    const token = store.get('sessionToken')
    if (token) {
      const auth = getAuth()
      const req = new Request('http://localhost/api/auth/sign-out', {
        method: 'POST',
        headers: { Cookie: `better-auth.session_token=${token}`, Origin: 'http://localhost' },
      })
      await auth.handler(req)
    }
  } finally {
    store.delete('sessionToken')
    store.delete('userId')
  }
}

export async function getSession(): Promise<SessionResult | null> {
  try {
    const token = store.get('sessionToken')
    if (!token) return null
    const auth = getAuth()
    const req = new Request('http://localhost/api/auth/get-session', {
      headers: { Cookie: `better-auth.session_token=${token}`, Origin: 'http://localhost' },
    })
    const res = await auth.handler(req)
    if (!res.ok) {
      store.delete('sessionToken')
      store.delete('userId')
      return null
    }
    const data = await res.json() as { user?: { id: string; email: string; name: string | null; createdAt: string }; session?: { id: string } }
    if (!data.user) return null
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: new Date(data.user.createdAt),
      },
      sessionId: data.session?.id ?? '',
    }
  } catch {
    return null
  }
}

export function getCurrentUserId(): string | undefined {
  return store.get('userId')
}
