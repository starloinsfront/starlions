import type { paths } from "@/common/api/schema"
import { mapPostDtoToPublicPost } from "@/features/posts/lib/mapPost"
import type { PublicPost } from "@/features/posts/model/post.types"
import type { MainPageData } from "../model/post.types"

export const PUBLIC_CONTENT_REVALIDATE_SECONDS = 60

type HomePageResponse = paths["/api/v1"]["get"]["responses"][200]["content"]["application/json"]

async function request<T>(url: string, options?: RequestInit): Promise<T | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (!apiUrl) {
    return null
  }

  try {
    const response = await fetch(`${apiUrl}${url}`, {
      ...options,
      next: {
        revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
        ...(options?.next ?? {}),
      },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function getMainPageData(): Promise<MainPageData | null> {
  const data = await request<HomePageResponse>("/api/v1")

  if (!data) {
    return null
  }

  return {
    usersCount: data.usersCount ?? 0,
    posts: (data.latestPosts ?? [])
      .map(mapPostDtoToPublicPost)
      .filter((post): post is PublicPost => Boolean(post)),
  }
}
