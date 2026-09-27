"use client"

import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"

const CLOSE_CONFIRM_MESSAGE =
  "Do you really want to close the creation of a publication?\nIf you close everything will be deleted"

/**
 * Manages the close-confirmation dialog state for CreatePostModal.
 *
 * Handles the race condition between Radix DismissableLayer events
 * and React state updates via a timestamp-based guard (`closedAtRef`).
 */
export const useCloseConfirmation = (onClose: () => void, reset: () => void) => {
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  // Timestamp of the last confirmation-dialog close.
  // Suppresses stale DismissableLayer events that fire after React
  // has already re-rendered with isCloseDialogOpen=false.
  const closedAtRef = useRef(0)

  // Guard: ignore triggers within 200ms of a dialog close
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

  return {
    isCloseDialogOpen,
    closeConfirmMessage: CLOSE_CONFIRM_MESSAGE,
    handleCloseAttempt,
    handleSaveDraft,
    handleDiscard,
    handleCancelClose,
    handleOverlayClick,
    blockOutsideInteraction,
  }
}
