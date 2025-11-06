import Image from 'next/image'
import Link from 'next/link'
import LikeButton from './LikeButton'

type Props = {
  id: string
  text: string
  imageUrl?: string
  user: { handle: string; displayName: string; avatarUrl?: string }
  createdAt: number
}

export default function PostItem({ id, text, imageUrl, user, createdAt }: Props) {
  return (
    <div className="border-b py-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.displayName} width={40} height={40} />
          ) : null}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/profile/${user.handle}`} className="font-semibold hover:underline">{user.displayName}</Link>
            <span className="text-slate-500">@{user.handle}</span>
            <span className="text-slate-400">· {new Date(createdAt).toLocaleString()}</span>
          </div>
          <Link href={`/post/${id}`} className="block whitespace-pre-wrap mt-1 hover:underline">{text}</Link>
          {imageUrl ? (
            <div className="mt-2 overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Link href={`/post/${id}`}><img src={imageUrl} alt="post" className="w-full h-auto" /></Link>
            </div>
          ) : null}
          <div className="mt-2">
            <LikeButton postId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}


