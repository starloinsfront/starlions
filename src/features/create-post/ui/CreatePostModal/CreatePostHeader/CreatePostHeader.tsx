import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./CreatePostHeader.module.css"
import type { CreatePostHeaderProps } from "./CreatePostHeader.types"

export const CreatePostHeader = ({ title, onCloseClick }: CreatePostHeaderProps) => {
  return (
    <div className={styles.header}>
      <Dialog.Title className={styles.title}>{title}</Dialog.Title>
      <button
        className={styles.closeButton}
        type="button"
        aria-label="Close"
        onClick={onCloseClick}
      >
        <Icon name="closeOutline" width={24} height={24} />
      </button>
    </div>
  )
}
