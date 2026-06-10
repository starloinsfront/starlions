export type CroppingStepProps = {
  selectedImages: string[]
  isGalleryPanelOpen: boolean
  onBack: () => void
  onNext: () => void
  onToggleGallery: () => void
  onReplaceImage: (index: number, newUrl: string) => void
  onAddMoreFiles: (files: FileList) => void
  onRemoveImage: (index: number) => void
}
