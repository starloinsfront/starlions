import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import s from "./AddPhotoMobile.module.css"
import { CreatePostHeader } from "@/features/create-post/ui/CreatePostModal/CreatePostHeader"

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
            <CreatePostHeader title="New Publication" onCloseClick={handleCloseAttempt} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

