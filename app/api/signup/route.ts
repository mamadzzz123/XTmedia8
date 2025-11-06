import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createUserAndSession, SESSION_COOKIE } from '../../../lib/auth'
import { hasVercelKv } from '../../../lib/kv'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

const Body = z.object({
  handle: z.string().min(3).max(20).regex(/^[A-Za-z0-9_]+$/),
  displayName: z.string().min(1).max(50)
})

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = Body.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { handle, displayName } = parsed.data

  // deny duplicate handle
  const res = await fetch(new URL('/api/user/check', req.url), { method: 'POST', body: JSON.stringify({ handle }) })
  if (res.status === 409) return NextResponse.json({ error: 'handle_taken' }, { status: 409 })

  const { user, session } = await createUserAndSession(handle, displayName)
  const cookie = JSON.stringify(session)
  const resp = NextResponse.json({ ok: true, user })
  const isProd = process.env.NODE_ENV === 'production'
  resp.cookies.set(SESSION_COOKIE, cookie, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd, // روی لوکال http هستیم، پس secure=false
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  })
  return resp
}


