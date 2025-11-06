"use client"
import useSWR from 'swr'
import Nav from '../../../components/Nav'
import Composer from '../../../components/Composer'
import PostItem from '../../../components/PostItem'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function HomePage() {
  const { data: session } = useSWR('/api/session', fetcher)
  const { data, mutate } = useSWR(() => session?.user ? '/api/post?scope=home' : null, fetcher)
  const posts = data?.posts ?? []
  return (
    <div>
      <Nav />
      <div className="px-4 py-4 space-y-4">
        {session?.user ? (
          <Composer onPosted={() => mutate()} />
        ) : (
          <div className="border rounded-xl p-4 text-center">
            برای ارسال پست و دیدن خانه، لطفاً <a href="/signup" className="text-xt-blue font-semibold">ثبت‌نام</a> کنید.
          </div>
        )}
        <div className="border rounded-xl">
          {posts.map((p: any) => (
            <PostItem key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  )
}


