export interface PostDetailComment {
  avatar: string
  id: number
  text: string
  time: string
  username: string
}

export interface PostDetailAuthor {
  avatar: string
  username: string
}

export interface PostDetailImage {
  id: string
  label: string
  src: string
}

export interface PostDetailData {
  author: PostDetailAuthor
  comments: PostDetailComment[]
  createdAt: string
  description: string
  id: number
  images: PostDetailImage[]
  likes: number
}
