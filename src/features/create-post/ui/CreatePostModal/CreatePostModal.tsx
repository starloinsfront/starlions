"use client"

import { useCallback } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { CreatePostHeader } from "./CreatePostHeader"
import { UploadStep } from "./UploadStep"
import styles from "./CreatePostModal.module.css"
import type { CreatePostModalProps } from "./CreatePostModal.types"

const CLOSE_CONFIRM_MESSAGE =
  "Do you really want to close the post creation? All changes will be lost."

export const CreatePostModal = ({
  isOpen,
  onClose,
  onSelectFiles,
  onOpenDraft,
}: CreatePostModalProps) => {
  const handleCloseAttempt = useCallback(() => {
    if (window.confirm(CLOSE_CONFIRM_MESSAGE)) {
      onClose()
    }
  }, [onClose])

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
          className={styles.modalContent}
          onPointerDownOutside={handleOverlayClick}
        >
          <CreatePostHeader title="Add Photo" onCloseClick={handleCloseAttempt} />

          <UploadStep onSelectFiles={onSelectFiles} onOpenDraft={onOpenDraft} />

          <Dialog.Description className={styles.srOnly}>
            Upload a photo to create a new post
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
