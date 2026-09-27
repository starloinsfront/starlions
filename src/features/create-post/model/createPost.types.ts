export type CreatePostPhoto = {
  id: string
  file: File
  previewUrl: string
  croppedUrl: string | null
  filterId: string | null
}
