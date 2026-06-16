import { toast } from "sonner"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"])
const FILE_VALIDATION_MESSAGE =
  "The photo must be less than 20 Mb and have JPEG or PNG format"

export function validateFiles(files: FileList): boolean {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
      toast.error(FILE_VALIDATION_MESSAGE)
      return false
    }
  }
  return true
}
