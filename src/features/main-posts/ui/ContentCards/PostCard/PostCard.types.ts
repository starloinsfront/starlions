import type { PublicPost } from "@/features/posts/model/post.types"

export type PostCardProps = PublicPost & {
  postHrefBase?: string
}
