import { kv as vercelKv } from '@vercel/kv'

type ScoreMember = { score: number; member: string }

function createMemoryKv() {
  const h = new Map<string, Record<string, any>>()
  const s = new Map<string, Set<string>>()
  const z = new Map<string, ScoreMember[]>()
  const v = new Map<string, any>()
  return {
    async hset(key: string, value: Record<string, any>) {
      h.set(key, value)
    },
    async hgetall<T>(key: string): Promise<T | null> {
      return (h.get(key) as any) || null
    },
    async set(key: string, value: any) {
      v.set(key, value)
    },
    async get<T>(key: string): Promise<T | null> {
      return (v.get(key) as any) ?? null
    },
    async sadd(key: string, member: string) {
      if (!s.has(key)) s.set(key, new Set())
      s.get(key)!.add(member)
    },
    async srem(key: string, member: string) {
      s.get(key)?.delete(member)
    },
    async sismember(key: string, member: string) {
      return s.get(key)?.has(member) ?? false
    },
    async smembers<T = string>(key: string): Promise<T[]> {
      return Array.from(s.get(key) ?? []) as any
    },
    async zadd(key: string, entry: ScoreMember) {
      const arr = z.get(key) ?? []
      arr.push(entry)
      arr.sort((a, b) => a.score - b.score)
      z.set(key, arr)
    },
    async zrevrange<T = string>(key: string, start: number, stop: number): Promise<T[]> {
      const arr = [...(z.get(key) ?? [])].sort((a, b) => b.score - a.score)
      const slice = arr.slice(start, stop + 1).map(e => e.member)
      return slice as any
    }
  }
}

export const hasVercelKv = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)
export const kv = hasVercelKv ? vercelKv : createMemoryKv()

// Keys
export const key = {
  userById: (id: string) => `user:${id}`,
  userIdByHandle: (handle: string) => `user:handle:${handle.toLowerCase()}`,
  session: (userId: string) => `session:${userId}`,
  followings: (userId: string) => `following:${userId}`,
  followers: (userId: string) => `followers:${userId}`,
  postById: (id: string) => `post:${id}`,
  postsByUser: (userId: string) => `posts:${userId}`,
  likesByPost: (postId: string) => `likes:post:${postId}`,
  likesByUser: (userId: string) => `likes:user:${userId}`,
  timelineGlobal: `timeline:global`
}


