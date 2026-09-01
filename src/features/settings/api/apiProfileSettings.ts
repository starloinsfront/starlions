import { client } from "@/common/api/client"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { getAuthHeaders } from "@/features/auth/api/apiAuth"
import type {
  SchemaProfileOutputDto,
  SchemaUpdateProfileInputDto,
  SchemaPresignAvatarInputDto,
  SchemaCountryResponseDto,
  SchemaCityResponseDto,
} from "@/common/api/schema"

export type ProfileSettingsDto = SchemaProfileOutputDto

//Goal: Load the current user profile from the server.
// What's inside: Sends a GET request to /api/v1/profile with an authorization token. The server receives an object with the following fields: userId, username, email, firstName, lastName, dateOfBirth,
// country code, city ID, city name, about me, avatar URL.

export const fetchProfileSettings = async (): Promise<ProfileSettingsDto> => {
  const result = await client.GET("/api/v1/profile", {
    headers: getAuthHeaders(),
  })

  return handleApiResponse(result, "Failed to fetch profile") as ProfileSettingsDto
}

//Why: Save profile changes (first name, last name, date of birth, country, city, "About Me").
// What's inside: Sends a PUT request to /api/v1/profile with the new data. The server accepts it, saves it, and returns the updated profile in the same format as a GET request—meaning
// the client doesn't need to make a second request.

export const updateProfileSettings = async (
  data: SchemaUpdateProfileInputDto,
): Promise<ProfileSettingsDto> => {
  const result = await client.PUT("/api/v1/profile", {
    body: data,
    headers: getAuthHeaders(),
  })

  return handleApiResponse(result, "Failed to update profile") as ProfileSettingsDto
}

//Why: Get a temporary link to upload an avatar to cloud storage (R2/S3).
// What's inside: Sends a POST to /api/v1/profile/avatar/presign, passing the file name, type (JPEG/PNG only), and size (up to 10 MB). The server returns an imageId (a unique identifier) ​​and uploadUrl (a temporary link that can be used to upload the file directly to the storage).

export const presignAvatar = async (file: File) => {
  const body: SchemaPresignAvatarInputDto = {
    fileName: file.name,
    contentType: file.type as SchemaPresignAvatarInputDto["contentType"],
    size: file.size,
  }

  const result = await client.POST("/api/v1/profile/avatar/presign", {
    body,
    headers: getAuthHeaders(),
  })

  return handleApiResponse(result, "Failed to presign avatar") as {
    imageId: string
    uploadUrl: string
  }
}

//Why: Upload the avatar file itself using the received temporary link.
// What's inside: Performs a regular fetch with the PUT method directly to the cloud storage URL (bypassing our API server). Simply sends the file as the request body. If the response is not OK, it throws an
// error.

export const uploadAvatarToPresignedUrl = async (
  uploadUrl: string,
  file: File,
) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  })

  if (!response.ok) {
    throw new Error(`Failed to upload avatar: ${response.statusText}`)
  }
}

//Why: Confirm the avatar upload—tell the server, "The file has been uploaded, associate it with my profile."
// What's inside: Sends a POST to /api/v1/profile/avatar with the imageId (obtained in the presign step). The server verifies the file, moves it from the temporary folder to the permanent one,
// deletes the old avatar, and returns the final avatarUrl—a public link to the avatar.

export const confirmAvatarUpload = async (imageId: string): Promise<string> => {
  const result = await client.POST("/api/v1/profile/avatar", {
    body: { imageId },
    headers: getAuthHeaders(),
  })

  const data = handleApiResponse(result, "Failed to confirm avatar") as {
    avatarUrl: string
  }

  return data.avatarUrl
}

export const removeAvatar = async (): Promise<void> => {
  const result = await client.DELETE("/api/v1/profile/avatar", {
    headers: getAuthHeaders(),
  })

  handleApiResponse(result, "Failed to remove avatar")
}

export const fetchCountries = async (): Promise<SchemaCountryResponseDto[]> => {
  const result = await client.GET("/api/v1/countries")

  return handleApiResponse(result, "Failed to fetch countries") as SchemaCountryResponseDto[]
}

export const fetchCities = async (
  countryCode: string,
  search?: string,
): Promise<SchemaCityResponseDto[]> => {
  const result = await client.GET("/api/v1/countries/{code}/cities", {
    params: {
      path: { code: countryCode },
      query: { search, limit: 20 },
    },
  })

  return handleApiResponse(result, "Failed to fetch cities") as SchemaCityResponseDto[]
}
