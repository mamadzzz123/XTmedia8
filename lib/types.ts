export type User = {
  id: string
  handle: string
  displayName: string
  bio?: string
  avatarUrl?: string
  createdAt: number
}

export type Session = {
  userId: string
  secret: string
}

export type Post = {
  id: string
  userId: string
  text: string
  imageUrl?: string
  createdAt: number
}


