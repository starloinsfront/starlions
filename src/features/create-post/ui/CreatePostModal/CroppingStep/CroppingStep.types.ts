import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"

export type CroppingStepProps = {
  photos: CreatePostPhoto[]
  selectedImages: string[]
  /** Cropped version for each photo; null = not yet cropped. */
  croppedImages: (string | null)[]
  onBack: () => void
  onNext: () => void
  /** Called when a photo is cropped, storing the result separately from selectedImages. */
  onCropImage: (index: number, url: string) => void
  onAddMoreFiles: (files: FileList) => void
  onRemoveImage: (index: number) => void
}
