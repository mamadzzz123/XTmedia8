"use client"
import useSWR from 'swr'
import { useState } from 'react'
import Nav from '../../../components/Nav'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function SettingsPage() {
  const { data } = useSWR('/api/user/me', fetcher)
  const me = data?.user
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [file, setFile] = useState<File | null>(null)

  if (!me) {
    return (
      <div>
        <Nav />
        <div className="px-4 py-4">لطفاً ابتدا <a className="text-xt-blue" href="/signup">ثبت‌نام</a> کنید.</div>
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <div className="px-4 py-6 max-w-xl">
        <h1 className="text-xl font-bold mb-4">تنظیمات پروفایل</h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">نام نمایشی</label>
            <input className="w-full border rounded-lg p-2" defaultValue={me.displayName} onChange={e => setDisplayName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">بیو</label>
            <textarea className="w-full border rounded-lg p-2" defaultValue={me.bio || ''} onChange={e => setBio(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">عکس پروفایل (اختیاری)</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <button
            onClick={async () => {
              const form = new FormData()
              if (displayName) form.append('displayName', displayName)
              if (bio) form.append('bio', bio)
              if (file) form.append('avatar', file)
              await fetch('/api/user/update', { method: 'POST', body: form })
              location.reload()
            }}
            className="bg-xt-blue text-white px-4 py-2 rounded-full"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  )
}


