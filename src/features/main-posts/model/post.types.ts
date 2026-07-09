import type { PublicPost } from "@/features/posts/model/post.types"

export type {
  PostDetailComment,
  PostDetailData,
  PostDetailLike,
  PublicPost,
  PublicPostAuthor,
  PublicPostImage,
} from "@/features/posts/model/post.types"

export type MainPageData = {
  usersCount: number
  posts: PublicPost[]
}
