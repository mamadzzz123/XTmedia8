"use client"
import { useState } from 'react'

export default function Composer({ onPosted }: { onPosted?: () => void }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!text.trim() && !file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('text', text)
      if (file) form.append('image', file)
      const res = await fetch('/api/post', { method: 'POST', body: form })
      if (!res.ok) throw new Error('failed')
      setText('')
      setFile(null)
      onPosted?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-3 flex flex-col gap-2">
      <textarea
        className="w-full resize-none outline-none"
        placeholder="چه خبر؟"
        maxLength={280}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex-1" />
        <button onClick={submit} disabled={loading} className="bg-xt-blue text-white px-3 py-1 rounded-full disabled:opacity-50">
          ارسال
        </button>
      </div>
    </div>
  )
}


