import type { paths } from "@/common/api/schema"
import { fetchWithRetry } from "@/common/api/fetchWithRetry"
import { ApiError } from "@/common/utils/api/error/apiError"
import { mapPostDtoToPublicPost } from "@/features/posts/lib/mapPost"
import type { PostDetailData, PublicPost } from "@/features/posts/model/post.types"

type PostResponse =
  paths["/api/v1/posts/{id}"]["get"]["responses"][200]["content"]["application/json"]

async function request<T>(url: string, options?: RequestInit): Promise<T | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is missing")
  }

  try {
    const response = await fetchWithRetry(`${apiUrl}${url}`, options)

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new ApiError(response.status, undefined, "Failed to load post", response)
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw error instanceof Error ? error : new Error("Failed to load post")
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
    interactionsAvailable: false,
    likes: [],
    likesCount: 0,
  }
}
