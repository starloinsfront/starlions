"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useCreatePost } from "../../model/useCreatePost"
import { useCloseConfirmation } from "./useCloseConfirmation"
import { useCreatePostMutation } from "../../api/useCreatePostMutation"
import { CroppingStep } from "./CroppingStep"
import { MobileCroppingStep } from "./MobileCroppingStep/MobileCroppingStep"
import { FiltersStep } from "./FiltersStep"
import { PublicationStep } from "./PublicationStep"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import styles from "./CreatePostModal.module.css"
import type { CreatePostModalProps } from "./CreatePostModal.types"
import AddPhoto from "@/features/create-post/ui/CreatePostModal/AddPhoto/AddPhoto"
import { AddPhotoMobile } from "@/features/create-post/ui/CreatePostModal/AddPhoto/AddPhotoMobile/AddPhotoMobile"
import { useMediaQuery } from "@/common/hooks/useMediaQuery"

export const CreatePostModal = ({ isOpen, onCloseAction, onOpenDraftAction }: CreatePostModalProps) => {
  const {
    step,
    photos,
    selectedImages,
    croppedImages,
    selectedFilters,
    selectFiles,
    addMoreFiles,
    removeImage,
    setCroppedImage,
    setFilter,
    goBack,
    goNext,
    goBackToCropping,
    goBackToFilters,
    resetCroppedImages,
    reset,
  } = useCreatePost()

  const createPost = useCreatePostMutation(() => {
    reset()
    onCloseAction()
  })

  const {
    isCloseDialogOpen,
    closeConfirmMessage,
    handleCloseAttempt,
    handleSaveDraft,
    handleDiscard,
    handleCancelClose,
    handleOverlayClick,
    blockOutsideInteraction,
  } = useCloseConfirmation(onCloseAction, reset)

  const isMobile = useMediaQuery("(max-width: 530px)")
  const hideMainDialog = isOpen && isMobile && step === "upload"

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <Dialog.Portal>
          {!hideMainDialog && (
            <Dialog.Overlay
              className={`${styles.overlay} ${isMobile && step !== "upload" ? styles.overlayMobile : ""}`}
            />
          )}
          <Dialog.Content
            aria-describedby={undefined}
            className={`${styles.modalContent} ${step === "filters" || step === "publication" ? styles.modalContentWide : ""} ${hideMainDialog ? styles.hidden : ""} ${isMobile && step !== "upload" ? styles.modalContentMobile : ""}`}
            onPointerDownOutside={isCloseDialogOpen ? blockOutsideInteraction : handleOverlayClick}
            onFocusOutside={(event: Event) => {
              if (isCloseDialogOpen) event.preventDefault()
            }}
          >
            <Dialog.Title className={styles.srOnly}>Create Post</Dialog.Title>
            {step === "upload" && !isMobile && (
              <AddPhoto
                handleCloseAttempt={handleCloseAttempt}
                onOpenDraftAction={onOpenDraftAction}
                selectFiles={selectFiles}
              />
            )}

            {step === "cropping" && selectedImages.length > 0 && !isMobile && (
              <CroppingStep
                photos={photos}
                selectedImages={selectedImages}
                croppedImages={croppedImages}
                onBack={goBack}
                onNext={goNext}
                onCropImage={setCroppedImage}
                onAddMoreFiles={addMoreFiles}
                onRemoveImage={removeImage}
              />
            )}

            {step === "cropping" && selectedImages.length > 0 && isMobile && (
              <MobileCroppingStep
                photos={photos}
                selectedImages={selectedImages}
                croppedImages={croppedImages}
                selectedFilters={selectedFilters}
                onBack={goBack}
                onNext={goNext}
                setFilter={setFilter}
                addMoreFiles={addMoreFiles}
                removeImage={removeImage}
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
                onPublish={(data) =>
                  createPost.mutate({
                    photos,
                    description: data.description,
                    location: data.location,
                  })
                }
                isPublishing={createPost.isPending}
              />
            )}

            <Dialog.Description className={styles.srOnly}>
              Upload a photo to create a new post
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AddPhotoMobile
        open={isOpen && step === "upload" && isMobile}
        handleCloseAttempt={handleCloseAttempt}
        selectFiles={selectFiles}
        onOpenDraftAction={onOpenDraftAction}
      />

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
