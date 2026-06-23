import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { postApi } from "./postApi"
import { blobUrlToFile } from "../model/blobUrlToFile"
import type { SchemaImageFileMetaDto } from "@/common/api/schema"

export type CreatePostVariables = {
  originalFiles: File[]
  croppedImages: (string | null)[]
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
  return useMutation({
    mutationFn: async ({
      originalFiles,
      croppedImages,
      description,
      location,
    }: CreatePostVariables) => {
      // Step 1 – resolve final files: use cropped version if available
      const files: File[] = await Promise.all(
        originalFiles.map((file, i) => {
          const cropped = croppedImages[i]
          return cropped ? blobUrlToFile(cropped, file) : Promise.resolve(file)
        }),
      )

      // Step 2 – request presigned URLs
      const fileMeta: SchemaImageFileMetaDto[] = files.map((file) => ({
        fileName: file.name,
        contentType: file.type,
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
      toast.success("Post published successfully!")
      onSuccess?.()
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish post")
    },
  })
}
