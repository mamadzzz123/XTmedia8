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
    kv.smembers(String(key.likesByPost(postId))),
    me ? kv.sismember(String(key.likesByPost(postId)), String(me.id)) : Promise.resolve(false)
  ])

  return NextResponse.json({ likeCount: countArr.length, liked: !!isMember })
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'bad_request' }, { status: 400 })

  const liked = await kv.sismember(String(key.likesByPost(postId)), String(me.id))

  if (liked) {
    await Promise.all([
      kv.srem(String(key.likesByPost(postId)), String(me.id)),
      kv.srem(String(key.likesByUser(String(me.id))), postId)
    ])
  } else {
    await Promise.all([
      kv.sadd(String(key.likesByPost(postId)), String(me.id)),
      kv.sadd(String(key.likesByUser(String(me.id))), postId)
    ])
  }

  const likeCount = (await kv.smembers(String(key.likesByPost(postId)))).length

  return NextResponse.json({ liked: !liked, likeCount })
}
