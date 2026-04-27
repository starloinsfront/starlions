export type PostImage = {
  background: string
  label: string
}

export type Post = {
  avatar: string
  description: string
  id: number
  images: PostImage[]
  time: string
  username: string
}
