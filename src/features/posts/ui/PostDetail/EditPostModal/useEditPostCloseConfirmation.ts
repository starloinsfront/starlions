"use client"

import { useCallback, useRef, useState } from "react"

export const EDIT_POST_CLOSE_CONFIRM_MESSAGE =
  "Do you really want to finish editing? If you close the changes you have made will not be saved"

type Options = {
  hasUnsavedChanges: boolean
  onClose: () => void
  onResetDraft: () => void
}

export const useEditPostCloseConfirmation = ({
  hasUnsavedChanges,
  onClose,
  onResetDraft,
}: Options) => {
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const closedAtRef = useRef(0)

  const handleCloseAttempt = useCallback(() => {
    if (Date.now() - closedAtRef.current < 200) {
      return
    }

    if (!hasUnsavedChanges) {
      onClose()
      return
    }

    setIsCloseDialogOpen(true)
  }, [hasUnsavedChanges, onClose])

  const handleConfirmDiscard = useCallback(() => {
    closedAtRef.current = Date.now()
    setIsCloseDialogOpen(false)
    onResetDraft()
    onClose()
  }, [onClose, onResetDraft])

  const handleStayOnForm = useCallback(() => {
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

  const blockOutsideInteraction = useCallback((event: Event) => {
    event.preventDefault()
  }, [])

  return {
    closeConfirmMessage: EDIT_POST_CLOSE_CONFIRM_MESSAGE,
    handleCloseAttempt,
    handleConfirmDiscard,
    handleStayOnForm,
    handleOverlayClick,
    blockOutsideInteraction,
    isCloseDialogOpen,
  }
}
