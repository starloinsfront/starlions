import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import s from "./AddPhotoMobile.module.css"
import { AddPhotoMobileHeader } from "./AddPhotoMobileHeader/AddPhotoMobileHeader"
import { AddPhotoMobileGallery } from "./AddPhotoMobileGallery/AddPhotoMobileGallery"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"

type AddPhotoMobileType = {
  open: boolean
  handleCloseAttempt: () => void
  photos: CreatePostPhoto[]
  selectFiles: (files: File[]) => void
  onOpenDraftAction: () => void
}

export const AddPhotoMobile = ({
  open,
  handleCloseAttempt,
  photos,
  selectFiles,
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
          <Dialog.Title className={s.srOnly}>New Publication</Dialog.Title>
          <AddPhotoMobileHeader onClose={handleCloseAttempt} />
          <AddPhotoMobileGallery photos={photos} onSelectFiles={selectFiles} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
