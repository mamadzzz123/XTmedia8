import { NextRequest, NextResponse } from 'next/server'
import { kv, hasVercelKv } from '../../../../lib/kv'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

// naive index: rely on Redis SCAN via vercel/kv KEYS
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').toLowerCase()
  if (!q) return NextResponse.json({ users: [] })
  // This uses the built-in scan/keys via REST; vercel/kv SDK doesn't expose KEYS, but we can fetch a small sample using scan command via API soon; here fallback: require exact prefix '@'
  // To keep it simple, return empty if too broad
  if (q.length < 2) return NextResponse.json({ users: [] })

  // We stored handle -> id keys as user:handle:<handle>
  // We cannot list keys efficiently; for demo, assume users store an index set 'user:index' of handles
  const handles = await kv.smembers<string>('user:index')
  const matched = handles.filter(h => h.includes(q)).slice(0, 20)
  const users = await Promise.all(matched.map(async (h) => {
    const id = await kv.get<string>(`user:handle:${h}`)
    if (!id) return null
    const u = await kv.hgetall<any>(`user:${id}`)
    return u
  }))
  return NextResponse.json({ users: users.filter(Boolean) })
}


