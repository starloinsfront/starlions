import React from "react"
import { CreatePostHeader } from "@/features/create-post/ui/CreatePostModal/CreatePostHeader"
import { UploadStep } from "@/features/create-post/ui/CreatePostModal/UploadStep"

type AddPhotoType = {
  handleCloseAttempt: () => void
  selectFiles: (files: File[]) => void
  onOpenDraftAction: () => void
}

const AddPhoto = ({ handleCloseAttempt, selectFiles, onOpenDraftAction }: AddPhotoType) => {
  return (
    <>
      <CreatePostHeader title="Add Photo" onCloseClick={handleCloseAttempt} />
      <UploadStep onSelectFilesAction={selectFiles} onOpenDraftAction={onOpenDraftAction} />
    </>
  )
}

export default AddPhoto
