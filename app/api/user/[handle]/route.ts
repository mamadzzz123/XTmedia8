import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../../lib/kv'
import type { User, Post } from '../../../../lib/types'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { handle: string } }) {
  const handle = params.handle
  const id = await kv.get<string | null>(key.userIdByHandle(handle))
  if (!id) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const user = await kv.hgetall<User>(key.userById(id))
  const postIds = await kv.zrevrange<string>(key.postsByUser(id), 0, 100)
  const postsRaw = await Promise.all(postIds.map(pid => kv.hgetall<Post>(key.postById(pid))))
  const posts = postsRaw.filter(Boolean).map(p => ({ ...p!, user: { handle: user!.handle, displayName: user!.displayName, avatarUrl: user!.avatarUrl } }))
  return NextResponse.json({ user, posts })
}


