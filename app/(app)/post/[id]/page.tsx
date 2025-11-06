"use client"
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import Nav from '../../../../components/Nav'
import PostItem from '../../../../components/PostItem'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function PostDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { data } = useSWR(() => id ? `/api/post/${id}` : null, fetcher)
  const post = data?.post
  return (
    <div>
      <Nav />
      <div className="px-4 py-4">
        {post ? (
          <div className="border rounded-xl">
            <PostItem {...post} />
          </div>
        ) : (
          <div>در حال بارگذاری…</div>
        )}
      </div>
    </div>
  )
}


