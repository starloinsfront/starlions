export type FiltersStepProps = {
  /** Original image blob URLs. */
  selectedImages: string[]
  /** Cropped version for each photo; null = not cropped (fallback to original). */
  croppedImages: (string | null)[]
  onBack: () => void
  onNext: () => void
  /** Called when user confirms they want to reset all crops and go back. */
  onResetCrop: () => void
}
