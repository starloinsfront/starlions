import { client } from "@/common/api/client"
import type { SchemaPostViewResponseDto, SchemaUpdatePostInputDto } from "@/common/api/schema"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { getAuthHeaders } from "@/features/auth/api/apiAuth"

export const updatePost = async (postId: string, body: SchemaUpdatePostInputDto) => {
  const result = await client.PATCH("/api/v1/posts/{id}", {
    params: {
      path: { id: postId },
    },
    body,
    headers: getAuthHeaders(),
  })

  return handleApiResponse<SchemaPostViewResponseDto, unknown>(result, "Failed to update post")
}
