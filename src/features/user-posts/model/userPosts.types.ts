export type UserPostListItem = {
  id: string
  coverUrl?: string
  imagesCount?: number
}

export type UserPostsPage = {
  items: UserPostListItem[]
  nextCursor?: string | null
}
