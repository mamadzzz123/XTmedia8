import { cookies } from 'next/headers'
import { kv, key } from './kv'
import type { Session, User } from './types'

export const SESSION_COOKIE = 'xt_session'

export async function createUserAndSession(handle: string, displayName: string): Promise<{ user: User, session: Session }> {
  const id = crypto.randomUUID()
  const user: User = { id, handle, displayName, createdAt: Date.now() }
  const secret = crypto.randomUUID()
  const session: Session = { userId: id, secret }

  await Promise.all([
    kv.hset(key.userById(id), user as any),
    kv.set(key.userIdByHandle(handle), id),
    kv.hset(key.session(id), session as any),
    kv.sadd('user:index', handle.toLowerCase())
  ])

  return { user, session }
}

export async function getSessionFromCookie() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE)?.value
  if (!cookie) return null
  try {
    const parsed = JSON.parse(cookie) as Session
    const stored = await kv.hgetall<Session>(key.session(parsed.userId))
    if (!stored || stored.secret !== parsed.secret) return null
    return stored
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const sess = await getSessionFromCookie()
  if (!sess) return null
  const user = await kv.hgetall<User>(key.userById(sess.userId))
  return user
}


