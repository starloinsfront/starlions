import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { postApi } from "./postApi"
import { blobUrlToFile } from "../model/blobUrlToFile"
import { FILTER_PRESETS } from "../ui/CreatePostModal/FiltersStep/filters"
import type { SchemaPresignFileInputDto } from "@/common/api/schema"
import type { CreatePostPhoto } from "../model/createPost.types"

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
async function applyFilterToImage(file: File, filterId: string | null): Promise<File> {
  if (!filterId || filterId === "normal") return file

  const preset = FILTER_PRESETS.find((f) => f.id === filterId)
  if (!preset || preset.value === "none") return file

  const img = new Image()
  const objectUrl = URL.createObjectURL(file)
  img.src = objectUrl
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })

  const canvas = document.createElement("canvas")
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext("2d")!
  ctx.filter = preset.value
  ctx.drawImage(img, 0, 0)

  URL.revokeObjectURL(objectUrl)

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], file.name, { type: file.type }))
    }, file.type)
  })
}

export const useCreatePostMutation = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: async ({
      photos,
      description,
      location,
    }: CreatePostVariables) => {
      // Step 1 – resolve final files: use cropped version if available, then apply filter
      const files: File[] = await Promise.all(
        photos.map(async (photo) => {
          const baseFile = photo.croppedUrl
            ? await blobUrlToFile(photo.croppedUrl, photo.file)
            : photo.file
          return applyFilterToImage(baseFile, photo.filterId)
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
      toast.success("Post published successfully!")
      onSuccess?.()
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish post")
    },
  })
}
