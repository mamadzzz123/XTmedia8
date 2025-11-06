import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../lib/kv'
import { getCurrentUser } from '../../../lib/auth'
import type { Post, User } from '../../../lib/types'
import { put } from '@vercel/blob'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const scope = url.searchParams.get('scope') || 'global'
  const me = await getCurrentUser()
  let postIds: string[] = []
  if (scope === 'home' && me) {
    const following = await kv.smembers<string>(key.followings(me.id))
    const timelines = await Promise.all(following.map(uid => kv.zrevrange<string>(key.postsByUser(uid), 0, 50)))
    postIds = timelines.flat()
  } else {
    // global
    postIds = await kv.zrevrange<string>(key.timelineGlobal, 0, 100)
  }
  const posts = await Promise.all(postIds.map(async (pid) => kv.hgetall<Post>(key.postById(pid))))
  const usersMap = new Map<string, User>()
  const withUsers = await Promise.all(posts.filter(Boolean).map(async (p) => {
    const u = usersMap.get(p!.userId) || await kv.hgetall<User>(key.userById(p!.userId))
    if (u) usersMap.set(u.id, u)
    return { ...p!, user: { handle: u?.handle || 'unknown', displayName: u?.displayName || 'Unknown', avatarUrl: u?.avatarUrl } }
  }))
  return NextResponse.json({ posts: withUsers })
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const form = await req.formData()
  const text = String(form.get('text') || '').slice(0, 280)
  const image = form.get('image') as File | null
  let imageUrl: string | undefined
  if (image) {
    const uploaded = await put(`images/${Date.now()}-${image.name}`, image, { access: 'public', addRandomSuffix: true })
    imageUrl = uploaded.url
  }
  const post: Post = { id: crypto.randomUUID(), userId: me.id, text, imageUrl, createdAt: Date.now() }
  await Promise.all([
    kv.hset(key.postById(post.id), post as any),
    kv.zadd(key.timelineGlobal, { score: post.createdAt, member: post.id }),
    kv.zadd(key.postsByUser(me.id), { score: post.createdAt, member: post.id })
  ])
  return NextResponse.json({ ok: true, postId: post.id })
}


