import { NextRequest, NextResponse } from 'next/server'
import { kv, key, hasVercelKv } from '../../../../lib/kv'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function POST(req: NextRequest) {
  const { handle } = await req.json()
  if (!handle) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const id = await kv.get<string | null>(key.userIdByHandle(handle))
  if (id) return NextResponse.json({ error: 'exists' }, { status: 409 })
  return NextResponse.json({ ok: true })
}


