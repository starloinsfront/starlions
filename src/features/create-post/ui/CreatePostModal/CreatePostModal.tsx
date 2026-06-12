"use client"

import { useCallback } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { useCreatePost } from "../../model/useCreatePost"
import { CroppingStep } from "./CroppingStep"
import { FiltersStep } from "./FiltersStep"
import { PublicationStep } from "./PublicationStep"
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
    selectedFilters,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage,
    setCroppedImage,
    setFilter,
    toggleGalleryPanel,
    goBack,
    goNext,
    goBackToCropping,
    goBackToFilters,
    resetCroppedImages,
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
          className={`${styles.modalContent} ${step === "filters" || step === "publication" ? styles.modalContentWide : ""}`}
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
              selectedFilters={selectedFilters}
              onBack={goBackToCropping}
              onNext={goNext}
              onResetCrop={resetCroppedImages}
              setFilter={setFilter}
            />
          )}

          {step === "publication" && selectedImages.length > 0 && (
            <PublicationStep
              selectedImages={selectedImages}
              croppedImages={croppedImages}
              selectedFilters={selectedFilters}
              onBack={goBackToFilters}
              onPublish={(data) => {
                console.log("Publishing post:", data)
                // TODO: call api.createPost(data) here
                reset()
                onClose()
              }}
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
