export type CreatePostModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectFiles: (files: FileList) => void
  onOpenDraft: () => void
}
