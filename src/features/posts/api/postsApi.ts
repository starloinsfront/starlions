import type { paths } from "@/common/api/schema"
import { mapPostDtoToPublicPost } from "@/features/posts/lib/mapPost"
import type { PostDetailData, PublicPost } from "@/features/posts/model/post.types"

type PostResponse =
  paths["/api/v1/posts/{id}"]["get"]["responses"][200]["content"]["application/json"]

async function request<T>(url: string, options?: RequestInit): Promise<T | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (!apiUrl) {
    return null
  }

  try {
    const response = await fetch(`${apiUrl}${url}`, options)

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function getPublicPostById(postId: string): Promise<PublicPost | null> {
  const data = await request<PostResponse>(`/api/v1/posts/${encodeURIComponent(postId)}`, {
    cache: "no-store",
  })

  return data ? mapPostDtoToPublicPost(data) : null
}

export async function getPostDetailData(postId: string): Promise<PostDetailData | null> {
  const post = await getPublicPostById(postId)

  if (!post) {
    return null
  }

  return {
    ...post,
    comments: [],
    likes: [],
    likesCount: 0,
  }
}
