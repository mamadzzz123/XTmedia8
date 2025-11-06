"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '../../../components/Nav'

export default function SignupPage() {
  const [handle, setHandle] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!handle.trim() || !displayName.trim()) return
    setLoading(true)
    const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ handle, displayName }) })
    if (res.ok) router.push('/home')
    setLoading(false)
  }

  return (
    <div>
      <Nav />
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold text-xt-blue mb-6">ساخت حساب XT</h1>
        <form onSubmit={submit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-1">نام کاربری (handle)</label>
            <input className="w-full border rounded-lg p-2" value={handle} onChange={e => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="مثلاً ali_1370" />
          </div>
          <div>
            <label className="block text-sm mb-1">نام نمایشی</label>
            <input className="w-full border rounded-lg p-2" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="نام شما" />
          </div>
          <button disabled={loading} className="bg-xt-blue hover:bg-xt-blueDark text-white px-4 py-2 rounded-full">ثبت‌نام</button>
        </form>
      </div>
    </div>
  )
}


