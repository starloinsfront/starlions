import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import { UploadStep } from "@/features/create-post/ui/CreatePostModal/UploadStep"
import s from "./AddPhotoMobile.module.css"

type AddPhotoMobileType = {
  open: boolean
  handleCloseAttempt: () => void
  selectFiles: (files: File[]) => void
  onOpenDraftAction: () => void
}

export const AddPhotoMobile = ({
  open,
  handleCloseAttempt,
  selectFiles,
  onOpenDraftAction,
}: AddPhotoMobileType) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleCloseAttempt()}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content
          aria-describedby={undefined}
          className={s.content}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title className={s.srOnly}>Add Photo</Dialog.Title>
          <div className={s.header}>
            <span className={s.title}>Add Photo</span>
            <button
              className={s.closeButton}
              type="button"
              aria-label="Close"
              onClick={handleCloseAttempt}
            >
              <Icon name="closeOutline" width={24} height={24} />
            </button>
          </div>
          <UploadStep onSelectFilesAction={selectFiles} onOpenDraftAction={onOpenDraftAction} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
