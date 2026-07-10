import { Icon } from "@/common/components/Icon/Icon"
import s from "./AddPhotoMobileHeader.module.css"

type AddPhotoMobileHeaderProps = {
  onClose: () => void
}

export const AddPhotoMobileHeader = ({ onClose }: AddPhotoMobileHeaderProps) => {
  return (
    <div className={s.header}>
      <button
        className={s.closeButton}
        type="button"
        aria-label="Close"
        onClick={onClose}
      >
        <Icon name="closeOutline" width={24} height={24} />
      </button>
      <span className={s.title}>New Publication</span>
      <button className={s.nextButton} type="button">
        Next
      </button>
    </div>
  )
}
