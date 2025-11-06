import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../lib/kv'
import { getCurrentUser } from '../../../lib/auth'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function GET(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ following: false })
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')
  if (!userId) return NextResponse.json({ following: false })
  const isFollowing = await kv.sismember(key.followings(me.id), userId)
  return NextResponse.json({ following: !!isFollowing })
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { userId } = await req.json()
  if (!userId || userId === me.id) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const already = await kv.sismember(key.followings(me.id), userId)
  if (already) {
    await Promise.all([
      kv.srem(key.followings(me.id), userId),
      kv.srem(key.followers(userId), me.id)
    ])
    return NextResponse.json({ following: false })
  } else {
    await Promise.all([
      kv.sadd(key.followings(me.id), userId),
      kv.sadd(key.followers(userId), me.id)
    ])
    return NextResponse.json({ following: true })
  }
}


