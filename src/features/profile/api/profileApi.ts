import { client } from "@/common/api/client"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import type { SchemaPublicProfileOutputDto } from "@/common/api/schema"

export const fetchPublicProfile = async (userId: string): Promise<SchemaPublicProfileOutputDto> => {
  const result = await client.GET("/api/v1/users/{id}/profile", {
    params: { path: { id: userId } },
  })

  const profile = handleApiResponse(result, "Failed to fetch profile")

  if (!profile) {
    throw new Error("Profile response is empty")
  }

  return profile as SchemaPublicProfileOutputDto
}
