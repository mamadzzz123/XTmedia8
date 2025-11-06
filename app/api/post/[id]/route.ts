import { NextRequest, NextResponse } from 'next/server'
import { kv, key } from '../../../../lib/kv'
import { Post, User } from '../../../../lib/types'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // پست را از KV دریافت می‌کنیم
  const postData = await kv.hgetall(key.postById(id))
  const post = postData as unknown as Post | null

  if (!post) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // اطلاعات صاحب پست
  const userData = await kv.hgetall(key.userById(post.userId))
  const user = userData as unknown as User | null

  return NextResponse.json({
    post,
    user
  })
}
