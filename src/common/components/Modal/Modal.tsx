import styles from "./Modal.module.css"

import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"
import { Icon } from "../Icon/Icon"

type ModalSize = "lg" | "md" | "sm"

type Props = {
  open: boolean
  onClose: () => void
  modalTitle: string
  ariaDescribedby?: string
  size?: ModalSize
} & ComponentPropsWithoutRef<"div">

export const Modal = ({
  size = "md",
  modalTitle,
  ariaDescribedby,
  onClose,
  children,
  className,
  open,
  ...rest
}: Props) => (
  <Dialog.Root open={open} onOpenChange={onClose} {...rest}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content
        className={clsx(styles.content, styles[size], className)}
        aria-describedby={
          ariaDescribedby
            ? ariaDescribedby
            : "Information dialog with important details and available actions"
        }
      >
        <div className={styles.header}>
          <Dialog.Title className={clsx(styles.title, "h1")}>{modalTitle}</Dialog.Title>
          <Dialog.Close asChild>
            <button className={styles.iconButton} aria-label="Close">
              <Icon name="closeOutline" />
            </button>
          </Dialog.Close>
        </div>
        <div className={styles.mainContent}>{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
