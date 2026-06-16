"use client"

import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import * as Dialog from "@radix-ui/react-dialog"
import { useCreatePost } from "../../model/useCreatePost"
import { CroppingStep } from "./CroppingStep"
import { FiltersStep } from "./FiltersStep"
import { PublicationStep } from "./PublicationStep"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import styles from "./CreatePostModal.module.css"
import type { CreatePostModalProps } from "./CreatePostModal.types"
import AddPhoto from "@/features/create-post/ui/CreatePostModal/AddPhoto/AddPhoto"

const CLOSE_CONFIRM_MESSAGE =
  "Do you really want to close the creation of a publication?\nIf you close everything will be deleted"

export const CreatePostModal = ({ isOpen, onClose, onOpenDraft }: CreatePostModalProps) => {
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  // Timestamp of the last confirmation-dialog close.
  // Used to suppress the outer DismissableLayer / onOpenChange that fires
  // for the SAME pointer event after React has already re-rendered with
  // isCloseDialogOpen=false (race between state update and Radix event).
  const closedAtRef = useRef(0)

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

  // Guard: if the confirmation dialog was closed < 200ms ago (same pointer
  // event), ignore the trigger — it's a stale event from the outer
  // DismissableLayer, not a genuine user close attempt.
  const handleCloseAttempt = useCallback(() => {
    if (Date.now() - closedAtRef.current < 200) return
    setIsCloseDialogOpen(true)
  }, [])

  // "Save draft" → close modal and return home (draft API TODO)
  const handleSaveDraft = useCallback(() => {
    closedAtRef.current = Date.now()
    setIsCloseDialogOpen(false)
    // TODO: call api.saveDraft(data) here
    toast.success("Draft saved")
    reset()
    onClose()
  }, [onClose, reset])

  // "Discard" → dismiss everything, close modal without saving
  const handleDiscard = useCallback(() => {
    closedAtRef.current = Date.now()
    setIsCloseDialogOpen(false)
    reset()
    onClose()
  }, [onClose, reset])

  // X / overlay on confirmation dialog → dismiss, stay on the form
  const handleCancelClose = useCallback(() => {
    closedAtRef.current = Date.now()
    setIsCloseDialogOpen(false)
  }, [])

  const handleOverlayClick = useCallback(
    (event: Event) => {
      event.preventDefault()
      handleCloseAttempt()
    },
    [handleCloseAttempt],
  )

  // When the confirmation dialog is open, suppress outside-interaction
  // handlers on the outer Dialog.Content so clicking the confirmation
  // overlay or X doesn't re-trigger handleCloseAttempt.
  const blockOutsideInteraction = useCallback((event: Event) => {
    event.preventDefault()
  }, [])

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content
            aria-describedby={undefined}
            className={`${styles.modalContent} ${step === "filters" || step === "publication" ? styles.modalContentWide : ""}`}
            onPointerDownOutside={isCloseDialogOpen ? blockOutsideInteraction : handleOverlayClick}
            onFocusOutside={(event: Event) => {
              if (isCloseDialogOpen) event.preventDefault()
            }}
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

      <ConfirmationModal
        isOpen={isCloseDialogOpen}
        title="Close"
        message={CLOSE_CONFIRM_MESSAGE}
        discardBtnText="Cancel"
        confirmBtnText="Save draft"
        onDiscard={handleDiscard}
        onConfirm={handleSaveDraft}
        onClose={handleCancelClose}
      />
    </>
  )
}
