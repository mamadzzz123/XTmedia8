"use client"
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import Nav from '../../../../components/Nav'
import PostItem from '../../../../components/PostItem'
import FollowButton from '../../../../components/FollowButton'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProfilePage() {
  const params = useParams<{ handle: string }>()
  const handle = params.handle
  const { data } = useSWR(() => handle ? `/api/user/${handle}` : null, fetcher)
  const { data: meData } = useSWR('/api/session', fetcher)
  const user = data?.user
  const posts = data?.posts ?? []
  const me = meData?.user

  return (
    <div>
      <Nav />
      <div className="px-4 py-4">
        {user ? (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.displayName} className="w-16 h-16 object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold">{user.displayName}</div>
              <div className="text-slate-500">@{user.handle}</div>
              {user.bio ? <div className="text-slate-700 mt-1 text-sm">{user.bio}</div> : null}
            </div>
            {me?.id === user.id ? (
              <a href="/settings" className="px-3 py-1 rounded-full text-sm border">ویرایش پروفایل</a>
            ) : (
              <FollowButton userId={user.id} />
            )}
          </div>
        ) : null}
        <div className="border rounded-xl">
          {posts.map((p: any) => (
            <PostItem key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  )
}


