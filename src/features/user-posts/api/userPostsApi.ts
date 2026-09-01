import { client } from "@/common/api/client"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import type { UserPostsPage } from "../model/userPosts.types"

type GetUserPostsParams = {
  cursor?: string
  limit?: number
}

const getUserPosts = async (userId: string, params?: GetUserPostsParams) => {
  const result = await client.GET("/api/v1/posts/user/{userId}/posts", {
    params: {
      path: { userId },
      query: {
        cursor: params?.cursor,
        limit: params?.limit,
      },
    },
  })

  const response = handleApiResponse(result, "Failed to load user posts")

  return {
    items:
      response?.items?.flatMap((item) =>
        item?.id
          ? [
              {
                id: item.id,
                coverUrl: item.cover?.url,
                imagesCount: item.imagesCount,
              },
            ]
          : [],
      ) ?? [],
    nextCursor: response?.nextCursor,
  } satisfies UserPostsPage
}

export const userPostsApi = {
  getUserPosts,
}
