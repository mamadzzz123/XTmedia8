import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../../lib/kv'
import type { Post, User } from '../../../../lib/types'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const post = await kv.hgetall<Post>(key.postById(id))
  if (!post) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const user = await kv.hgetall<User>(key.userById(post.userId))
  const likeCount = (await kv.smembers<string>(key.likesByPost(id))).length
  return NextResponse.json({
    post: {
      ...post,
      user: { handle: user?.handle || 'unknown', displayName: user?.displayName || 'Unknown', avatarUrl: user?.avatarUrl },
      likeCount
    }
  })
}


