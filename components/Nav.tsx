"use client"
import Link from 'next/link'
import useSWR from 'swr'
import { useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Nav() {
  const { data } = useSWR('/api/session', fetcher)
  const me = data?.user as { handle?: string } | undefined
  const profileHref = useMemo(() => me?.handle ? `/profile/${me.handle}` : '/signup', [me?.handle])
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/home" className="font-bold text-xt-blue">XT</Link>
        <div className="flex-1" />
        <Link href="/explore" className="text-slate-600 hover:text-xt-blue">اکسپلور</Link>
        <Link href="/search" className="text-slate-600 hover:text-xt-blue">جستجو</Link>
        {me?.handle ? (
          <Link href="/settings" className="text-slate-600 hover:text-xt-blue">تنظیمات</Link>
        ) : null}
        <Link href={profileHref} className="text-white bg-xt-blue px-3 py-1 rounded-full hover:bg-xt-blueDark transition">پروفایل</Link>
      </div>
    </nav>
  )
}


