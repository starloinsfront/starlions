export type PublicationStepProps = {
  /** Original image blob URLs. */
  selectedImages: string[]
  /** Cropped version for each photo; null = not cropped (fallback to original). */
  croppedImages: (string | null)[]
  /** Selected filter ID per photo; null = no filter (uses "normal"). */
  selectedFilters: (string | null)[]
  onBack: () => void
  onPublish: (data: PublicationData) => void
  /** Whether the publish mutation is currently in flight. */
  isPublishing?: boolean
}

export type PublicationData = {
  description: string
  location: string
}
