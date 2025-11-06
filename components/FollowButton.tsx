"use client"
import { useState, useEffect } from 'react'

export default function FollowButton({ userId }: { userId: string }) {
  const [following, setFollowing] = useState<boolean | null>(null)
  useEffect(() => {
    let mounted = true
    fetch(`/api/follow?userId=${userId}`).then(r => r.json()).then(d => {
      if (mounted) setFollowing(!!d.following)
    })
    return () => { mounted = false }
  }, [userId])

  async function toggle() {
    const res = await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    const d = await res.json()
    setFollowing(!!d.following)
  }

  if (following === null) return null

  return (
    <button onClick={toggle} className={`px-3 py-1 rounded-full text-sm border ${following ? 'bg-slate-100' : 'bg-xt-blue text-white border-xt-blue'}`}>
      {following ? 'دنبال می‌کنید' : 'دنبال کردن'}
    </button>
  )
}


