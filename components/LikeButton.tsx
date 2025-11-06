"use client"
import { useEffect, useState } from 'react'

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    let mounted = true
    fetch(`/api/like?postId=${postId}`).then(r => r.json()).then(d => {
      if (!mounted) return
      setLiked(!!d.liked)
      setCount(Number(d.likeCount || 0))
    })
    return () => { mounted = false }
  }, [postId])

  async function toggle() {
    const res = await fetch('/api/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId }) })
    const d = await res.json()
    setLiked(!!d.liked)
    setCount(Number(d.likeCount || 0))
  }

  return (
    <button onClick={toggle} className={`text-sm px-2 py-1 rounded-full border ${liked ? 'bg-xt-blue text-white border-xt-blue' : 'bg-white'}`}>
      ❤️ {count}
    </button>
  )
}


