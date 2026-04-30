import { Icon } from "@/common/components/Icon/Icon"
import s from "./PostDetail.module.css"

type Props = {
  onClose: () => void
}

export const PostDetailCloseButton = ({ onClose }: Props) => {
  return (
    <button
      aria-label="Close post details"
      className={s.closeButton}
      onClick={onClose}
      type="button"
    >
      <Icon height={24} name="closeOutline" width={24} />
    </button>
  )
}
