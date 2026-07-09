export type PublicPostAuthor = {
  authorId: string
  username: string
}

export type PublicPostImage = {
  url: string
}

export type PublicPost = {
  id: string
  author: PublicPostAuthor
  createdAt: string
  description: string
  images: PublicPostImage[]
}

export type PostDetailComment = {
  answersCount?: number
  avatarLabel: string
  id: string
  isLiked?: boolean
  likesCount?: number
  replies?: PostDetailComment[]
  text: string
  time: string
  username: string
}

export type PostDetailLike = {
  avatarLabel: string
  id: string
  isFollowing: boolean
  username: string
}

export type PostDetailData = PublicPost & {
  comments: PostDetailComment[]
  likes: PostDetailLike[]
  likesCount: number
}
