import { NextRequest, NextResponse } from 'next/server'
import { kv, key } from '../../../../lib/kv'
import { Post, User } from '../../../../lib/types'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // پست را از KV دریافت می‌کنیم
  const post = await kv.hgetall<Post>(key.postById(id))

  if (!post) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // اطلاعات صاحب پست
  const user = await kv.hgetall<User>(key.userById(post.userId))

  return NextResponse.json({
    post,
    user
  })
}
