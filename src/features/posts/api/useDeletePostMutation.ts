import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { client } from "@/common/api/client"
import { ROUTES } from "@/common/constants/route"
import { getAuthHeaders } from "@/features/auth/api/apiAuth"
import { USER_POSTS_QUERY_KEY } from "@/features/user-posts/model/constants"

export const useDeletePostMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await client.DELETE("/api/v1/posts/{id}", {
        headers: getAuthHeaders(),
        params: {
          path: {
            id: postId,
          },
        },
      })

      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [USER_POSTS_QUERY_KEY] })
      router.replace(ROUTES.profile)
    },
  })
}
