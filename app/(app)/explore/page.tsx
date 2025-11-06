"use client"
import useSWR from 'swr'
import Nav from '../../../components/Nav'
import PostItem from '../../../components/PostItem'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ExplorePage() {
  const { data } = useSWR('/api/post?scope=global', fetcher)
  const posts = data?.posts ?? []
  return (
    <div>
      <Nav />
      <div className="px-4 py-4">
        <h2 className="font-bold text-xl mb-4">اکسپلور</h2>
        <div className="border rounded-xl">
          {posts.map((p: any) => (
            <PostItem key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  )
}


