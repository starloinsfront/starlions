export type CroppingStepProps = {
  selectedImages: string[]
  isGalleryPanelOpen: boolean
  onBack: () => void
  onNext: () => void
  onToggleGallery: () => void
  onAddMoreFiles: (files: FileList) => void
  onRemoveImage: (index: number) => void
}
