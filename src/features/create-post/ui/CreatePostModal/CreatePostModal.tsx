"use client"

import { useCallback } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { useCreatePost } from "../../model/useCreatePost"
import { CroppingStep } from "./CroppingStep"
import { FiltersStep } from "./FiltersStep"
import styles from "./CreatePostModal.module.css"
import type { CreatePostModalProps } from "./CreatePostModal.types"
import AddPhoto from "@/features/create-post/ui/CreatePostModal/AddPhoto/AddPhoto"

const CLOSE_CONFIRM_MESSAGE =
  "Do you really want to close the post creation? All changes will be lost."

export const CreatePostModal = ({ isOpen, onClose, onOpenDraft }: CreatePostModalProps) => {
  const {
    step,
    selectedImages,
    croppedImages,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage,
    setCroppedImage,
    toggleGalleryPanel,
    goBack,
    goNext,
    goBackToCropping,
    reset,
  } = useCreatePost()

  const handleCloseAttempt = useCallback(() => {
    if (window.confirm(CLOSE_CONFIRM_MESSAGE)) {
      reset()
      onClose()
    }
  }, [onClose, reset])

  const handleOverlayClick = useCallback(
    (event: Event) => {
      event.preventDefault()
      handleCloseAttempt()
    },
    [handleCloseAttempt],
  )

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          aria-describedby={undefined}
          className={`${styles.modalContent} ${step === "filters" ? styles.modalContentWide : ""}`}
          onPointerDownOutside={handleOverlayClick}
        >
          {step === "upload" && (
            <AddPhoto
              handleCloseAttempt={handleCloseAttempt}
              onOpenDraft={onOpenDraft}
              selectFiles={selectFiles}
            />
          )}

          {step === "cropping" && selectedImages.length > 0 && (
            <CroppingStep
              selectedImages={selectedImages}
              croppedImages={croppedImages}
              isGalleryPanelOpen={isGalleryPanelOpen}
              onBack={goBack}
              onNext={goNext}
              onToggleGallery={toggleGalleryPanel}
              onCropImage={setCroppedImage}
              onAddMoreFiles={addMoreFiles}
              onRemoveImage={removeImage}
            />
          )}

          {step === "filters" && selectedImages.length > 0 && (
            <FiltersStep
              selectedImages={selectedImages}
              croppedImages={croppedImages}
              onBack={goBackToCropping}
              onNext={goNext}
            />
          )}

          <Dialog.Description className={styles.srOnly}>
            Upload a photo to create a new post
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
