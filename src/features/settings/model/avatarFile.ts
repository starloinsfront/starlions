export const MAX_AVATAR_FILE_SIZE = 10 * 1024 * 1024
export const AVATAR_OUTPUT_SIZE = 512
export const AVATAR_OUTPUT_TYPE = "image/jpeg"
export const AVATAR_OUTPUT_QUALITY = 0.9

const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png"])

export const getAvatarFileValidationError = (file: File): string | null => {
  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    return "The photo must have JPEG or PNG format"
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    return "The photo must be 10 MB or smaller"
  }

  return null
}
