import styles from "./Modal.module.css"

import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

type ModalSize = "lg" | "md" | "sm"

type Props = {
  open: boolean
  onClose: () => void
  modalTitle: string
  size?: ModalSize
} & ComponentPropsWithoutRef<"div">

export const Modal = ({
  size = "md",
  modalTitle,
  onClose,
  children,
  className,
  open,
  ...rest
}: Props) => (
  <Dialog.Root open={open} onOpenChange={onClose} {...rest}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.Overlay} />
      <Dialog.Content className={clsx(styles.Content, styles[size], className)}>
        <div className={styles.Header}>
          <Dialog.Title className={styles.Title}>{modalTitle}</Dialog.Title>
          <Dialog.Close asChild>
            <button className={styles.IconButton} aria-label="Close">
              X
            </button>
          </Dialog.Close>
        </div>
        <div className={styles.MainContent}>{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
