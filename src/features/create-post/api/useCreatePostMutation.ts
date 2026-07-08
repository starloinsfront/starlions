import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { postApi } from "./postApi"
import { blobUrlToFile } from "../model/blobUrlToFile"
import type { SchemaPresignFileInputDto } from "@/common/api/schema"
import type { CreatePostPhoto } from "../model/createPost.types"
import { USER_POSTS_QUERY_KEY } from "@/features/user-posts/model/constants"

export type CreatePostVariables = {
  photos: CreatePostPhoto[]
  description: string
  location: string
}

/**
 * TanStack Query mutation that orchestrates the full post-creation flow:
 *
 * 1. Resolve final files (cropped versions when available, originals otherwise)
 * 2. Request presigned URLs for all image files
 * 3. Upload each image to its presigned URL in parallel
 * 4. Create the post with the resulting image IDs
 */
export const useCreatePostMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      photos,
      description,
      location,
    }: CreatePostVariables) => {
      // Step 1 – resolve final files: use cropped version if available
      const files: File[] = await Promise.all(
        photos.map((photo) => {
          return photo.croppedUrl
            ? blobUrlToFile(photo.croppedUrl, photo.file)
            : Promise.resolve(photo.file)
        }),
      )

      // Step 2 – request presigned URLs
      const fileMeta: SchemaPresignFileInputDto[] = files.map((file) => ({
        fileName: file.name,
        contentType: file.type as SchemaPresignFileInputDto["contentType"],
        size: file.size,
      }))

      const presignResponse = await postApi.requestPresignedUrls(fileMeta)
      if (!presignResponse?.items?.length) {
        throw new Error("No presigned URLs returned from server")
      }

      // Step 3 – upload images in parallel
      const { items } = presignResponse
      await Promise.all(
        items.map((img, i) => postApi.uploadToPresignedUrl(img.uploadUrl, files[i])),
      )

      // Step 4 – create the post
      const imageIds = items.map((img) => img.imageId)
      return postApi.createPost({
        description,
        imageIds,
        status: "PUBLISHED",
        ...(location ? { location } : {}),
      })
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USER_POSTS_QUERY_KEY] })
      toast.success("Post published successfully!")
      onSuccess?.()
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish post")
    },
  })
}
