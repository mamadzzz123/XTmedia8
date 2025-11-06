import { put } from '@vercel/blob'

export async function uploadImage(file: File) {
  const res = await put(`images/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return res.url
}


