import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import s from "./AddPhotoMobile.module.css"
import { Icon } from "@/common/components/Icon/Icon"

type AddPhotoMobileType = {
  open: boolean
  handleCloseAttempt: () => void
  selectFiles: (files: File[]) => void
  onOpenDraftAction: () => void
}

export const AddPhotoMobile = ({ open, handleCloseAttempt }: AddPhotoMobileType) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleCloseAttempt()}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content
          aria-describedby={undefined}
          className={s.content}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title className={s.srOnly}>New Publication</Dialog.Title>
          <div className={s.header}>
            <button
              className={s.closeButton}
              type="button"
              aria-label="Close"
              onClick={handleCloseAttempt}
            >
              <Icon name="closeOutline" width={24} height={24} />
            </button>
            <span className={s.title}>New Publication</span>
            <button className={s.nextButton} type="button">
              Next
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

