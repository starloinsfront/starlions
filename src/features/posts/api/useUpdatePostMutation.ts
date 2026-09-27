import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { USER_POSTS_QUERY_KEY } from "@/features/user-posts/model/constants"
import { POST_DETAIL_QUERY_KEY } from "../model/constants"
import { updatePost } from "./updatePost"

type UpdatePostVariables = {
  postId: string
  description: string
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, description }: UpdatePostVariables) =>
      updatePost(postId, { description }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [POST_DETAIL_QUERY_KEY, variables.postId] })
      void queryClient.invalidateQueries({ queryKey: [USER_POSTS_QUERY_KEY] })
      toast.success("Post updated successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update post")
    },
  })
}
