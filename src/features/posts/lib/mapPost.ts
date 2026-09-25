import type { PublicPost } from "@/features/posts/model/post.types"

type PostDto = {
  id?: string
  description?: string | null
  createdAt?: string
  author?: {
    authorId?: string
    username?: string
  }
  images?: {
    url?: string
  }[]
}

export const mapPostDtoToPublicPost = (post: PostDto): PublicPost | null => {
  if (!post.id || !post.createdAt || !post.author) {
    return null
  }

  return {
    id: post.id,
    author: {
      authorId: post.author.authorId ?? "",
      username: post.author.username ?? "Unknown user",
    },
    createdAt: post.createdAt,
    description: post.description ?? "",
    images: (post.images ?? [])
      .filter((image): image is { url: string } => Boolean(image.url))
      .map((image) => ({
        url: image.url,
      })),
  }
}
