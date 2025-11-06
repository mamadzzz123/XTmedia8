import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../../lib/kv'
import { getCurrentUser } from '../../../../lib/auth'
import type { User } from '../../../../lib/types'
import { put } from '@vercel/blob'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function POST(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const form = await req.formData()
  const displayName = String(form.get('displayName') || me.displayName).slice(0, 50)
  const bio = String(form.get('bio') || me.bio || '').slice(0, 200)
  let avatarUrl = me.avatarUrl
  const avatar = form.get('avatar') as File | null
  if (avatar) {
    try {
      // Try Vercel Blob first
      const uploaded = await put(`avatars/${me.id}-${Date.now()}-${avatar.name}`, avatar, { access: 'public', addRandomSuffix: true })
      avatarUrl = uploaded.url
    } catch {
      // Fallback: data URL (dev only)
      const buf = Buffer.from(await avatar.arrayBuffer())
      const base64 = buf.toString('base64')
      avatarUrl = `data:${avatar.type};base64,${base64}`
    }
  }
  const updated: User = { ...me, displayName, bio, avatarUrl }
  await Promise.all([
    kv.hset(key.userById(me.id), updated as any)
  ])
  return NextResponse.json({ ok: true, user: updated })
}


