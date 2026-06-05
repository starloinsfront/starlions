import React from "react"
import { CreatePostHeader } from "@/features/create-post/ui/CreatePostModal/CreatePostHeader"
import { UploadStep } from "@/features/create-post/ui/CreatePostModal/UploadStep"

type AddPhotoType = {
  handleCloseAttempt: () => void
  selectFiles: (files: FileList) => void
  onOpenDraft: () => void
}

const AddPhoto = ({ handleCloseAttempt, selectFiles, onOpenDraft }: AddPhotoType) => {
  return (
    <>
      <CreatePostHeader title="Add Photo" onCloseClick={handleCloseAttempt} />
      <UploadStep onSelectFiles={selectFiles} onOpenDraft={onOpenDraft} />
    </>
  )
}

export default AddPhoto
