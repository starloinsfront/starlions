import { client } from "@/common/api/client"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { getAuthHeaders } from "@/features/auth/api/apiAuth"
import type {
  SchemaPresignFileInputDto,
  SchemaPresignInputDto,
  SchemaCreatePostInputDto,
  SchemaPostViewResponseDto,
} from "@/common/api/schema"

type PresignedImageItem = {
  imageId: string
  uploadUrl: string
}

type PresignImagesResponse = {
  items: PresignedImageItem[]
}

type LegacyPresignedImageItem = {
  imageId: string
  presignedUrl: string
}

type LegacyPresignImagesResponse = {
  images: LegacyPresignedImageItem[]
}

const normalizePresignResponse = (
  response: PresignImagesResponse | LegacyPresignImagesResponse | undefined,
): PresignImagesResponse | undefined => {
  if (!response) return undefined

  if ("items" in response) {
    return response
  }

  return {
    items: response.images.map((item) => ({
      imageId: item.imageId,
      uploadUrl: item.presignedUrl,
    })),
  }
}

/**
 * Requests presigned upload URLs for a batch of image files.
 *
 * The server validates format (JPEG/PNG), size (≤ 20 MB) and count (≤ 10),
 * then returns temporary presigned URLs together with unique image IDs.
 */
const requestPresignedUrls = async (files: SchemaPresignInputDto["files"]) => {
  const result = await client.POST("/api/v1/posts/images/presign", {
    body: { files },
    headers: getAuthHeaders(),
  })

  const response = handleApiResponse<PresignImagesResponse | LegacyPresignImagesResponse, unknown>(
    result,
    "Failed to get presigned URLs",
  )

  return normalizePresignResponse(response)
}

/**
 * Uploads a single image blob to a presigned URL via PUT.
 *
 * This request goes directly to the storage service (e.g. S3),
 * bypassing our API server. No auth headers are needed.
 */
const uploadToPresignedUrl = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  })

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`)
  }
}

/**
 * Creates a new post after all images have been uploaded.
 *
 * The server links the previously uploaded images (by ID) to the new post.
 */
const createPost = async (data: SchemaCreatePostInputDto) => {
  const result = await client.POST("/api/v1/posts", {
    body: data,
    headers: getAuthHeaders(),
  })

  return handleApiResponse<SchemaPostViewResponseDto, unknown>(
    result,
    "Failed to create post",
  )
}

export const postApi = {
  requestPresignedUrls,
  uploadToPresignedUrl,
  createPost,
}
