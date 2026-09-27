"use client"

import { useCallback, useState } from "react"

import { Button } from "@/common/components/Button/Button"
import { ConfirmationModal } from "@/common/components/ConfirmationModal"
import { Modal } from "@/common/components/Modal/Modal"
import { DescriptionField } from "@/features/create-post/ui/CreatePostModal/PublicationStep/DescriptionField/DescriptionField"
import { useUpdatePostMutation } from "@/features/posts/api/useUpdatePostMutation"
import { MAX_POST_DESCRIPTION_LENGTH } from "@/features/posts/model/constants"

import s from "./EditPostModal.module.css"
import { useEditPostCloseConfirmation } from "./useEditPostCloseConfirmation"

type Props = {
  description: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: (description: string) => void
  postId: string
}

export const EditPostModal = ({ description, isOpen, onClose, onSuccess, postId }: Props) => {
  const [draftDescription, setDraftDescription] = useState(description)
  const { mutate, isPending } = useUpdatePostMutation()

  const resetDraft = useCallback(() => {
    setDraftDescription(description)
  }, [description])

  const {
    closeConfirmMessage,
    handleCloseAttempt,
    handleConfirmDiscard,
    handleStayOnForm,
    handleOverlayClick,
    blockOutsideInteraction,
    isCloseDialogOpen,
  } = useEditPostCloseConfirmation({
    hasUnsavedChanges: draftDescription !== description,
    onClose,
    onResetDraft: resetDraft,
  })

  const handleSave = () => {
    mutate(
      { postId, description: draftDescription },
      {
        onSuccess: (data) => {
          onSuccess?.(data?.description ?? draftDescription)
          onClose()
        },
      },
    )
  }

  const isUnchanged = draftDescription === description

  return (
    <>
      <Modal
        modalTitle="Edit Post"
        onClose={handleCloseAttempt}
        onFocusOutside={(event) => {
          if (isCloseDialogOpen) {
            event.preventDefault()
          }
        }}
        onPointerDownOutside={isCloseDialogOpen ? blockOutsideInteraction : handleOverlayClick}
        open={isOpen}
        size="sm"
        className={s.zIndex}
      >
        <form
          className={s.form}
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <DescriptionField
            description={draftDescription}
            maxDescriptionLength={MAX_POST_DESCRIPTION_LENGTH}
            onChange={(event) => {
              setDraftDescription(event.target.value)
            }}
          />

          <div className={s.actions}>
            <Button disabled={isPending || isUnchanged} isLoading={isPending} type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        confirmBtnText="Yes"
        discardBtnText="No"
        isOpen={isCloseDialogOpen}
        message={closeConfirmMessage}
        onClose={handleStayOnForm}
        onConfirm={handleConfirmDiscard}
        onDiscard={handleStayOnForm}
        title="Finish editing"
      />
    </>
  )
}
