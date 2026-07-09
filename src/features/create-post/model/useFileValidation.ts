import { toast } from "sonner"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"])
export const MAX_PHOTOS = 10
const FILE_VALIDATION_MESSAGE =
  "The photo must be less than 20 Mb and have JPEG or PNG format"
const MAX_PHOTOS_MESSAGE = `You can add up to ${MAX_PHOTOS} photos`
const SQUARE_IMAGE_MESSAGE = "Photo must be square (width must equal height)"

function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => resolve({ width: 0, height: 0 })
    img.src = URL.createObjectURL(file)
  })
}

export async function validateFiles(
  files: File[],
  currentCount = 0,
): Promise<boolean> {
  if (currentCount + files.length > MAX_PHOTOS) {
    toast.error(MAX_PHOTOS_MESSAGE)
    return false
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
      toast.error(FILE_VALIDATION_MESSAGE)
      return false
    }

    const { width, height } = await loadImageDimensions(file)
    if (width !== height) {
      toast.error(SQUARE_IMAGE_MESSAGE)
      return false
    }
  }

  return true
}
