"use client"
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Nav from '../../../components/Nav'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function SearchPage() {
  const [q, setQ] = useState('')
  const { data } = useSWR(() => q ? `/api/user/search?q=${encodeURIComponent(q)}` : null, fetcher)
  const users = data?.users ?? []
  return (
    <div>
      <Nav />
      <div className="px-4 py-4 space-y-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="جستجوی کاربر (@handle)" className="w-full border rounded-lg p-2" />
        <div className="space-y-2">
          {users.map((u: any) => (
            <Link key={u.id} href={`/profile/${u.handle}`} className="block p-3 border rounded-lg hover:bg-slate-50">
              <div className="font-semibold">{u.displayName}</div>
              <div className="text-slate-500 text-sm">@{u.handle}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


