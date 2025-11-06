import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { hasVercelKv } from '../../../../lib/kv'

export const runtime = hasVercelKv ? 'edge' : 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json({ user })
}


