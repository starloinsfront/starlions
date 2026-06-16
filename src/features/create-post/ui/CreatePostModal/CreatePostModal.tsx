"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useCreatePost } from "../../model/useCreatePost"
import { useCloseConfirmation } from "./useCloseConfirmation"
import { CroppingStep } from "./CroppingStep"
import { FiltersStep } from "./FiltersStep"
import { PublicationStep } from "./PublicationStep"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import styles from "./CreatePostModal.module.css"
import type { CreatePostModalProps } from "./CreatePostModal.types"
import AddPhoto from "@/features/create-post/ui/CreatePostModal/AddPhoto/AddPhoto"

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

  const {
    isCloseDialogOpen,
    closeConfirmMessage,
    handleCloseAttempt,
    handleSaveDraft,
    handleDiscard,
    handleCancelClose,
    handleOverlayClick,
    blockOutsideInteraction,
  } = useCloseConfirmation(onClose, reset)

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
        message={closeConfirmMessage}
        discardBtnText="Cancel"
        confirmBtnText="Save draft"
        onDiscard={handleDiscard}
        onConfirm={handleSaveDraft}
        onClose={handleCancelClose}
      />
    </>
  )
}
