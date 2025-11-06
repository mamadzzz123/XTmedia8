import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../lib/kv'
import { getCurrentUser } from '../../../lib/auth'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const postId = url.searchParams.get('postId')
  if (!postId) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const me = await getCurrentUser()
  const [countArr, isMember] = await Promise.all([
    kv.smembers<string>(key.likesByPost(postId)),
    me ? kv.sismember(key.likesByPost(postId), me.id) : Promise.resolve(false)
  ])
  return NextResponse.json({ likeCount: countArr.length, liked: !!isMember })
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const liked = await kv.sismember(key.likesByPost(postId), me.id)
  if (liked) {
    await Promise.all([
      kv.srem(key.likesByPost(postId), me.id),
      kv.srem(key.likesByUser(me.id), postId)
    ])
  } else {
    await Promise.all([
      kv.sadd(key.likesByPost(postId), me.id),
      kv.sadd(key.likesByUser(me.id), postId)
    ])
  }
  const likeCount = (await kv.smembers<string>(key.likesByPost(postId))).length
  return NextResponse.json({ liked: !liked, likeCount })
}


