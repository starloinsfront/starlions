import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"

import { Icon } from "../Icon/Icon"

import styles from "./Modal.module.css"

type ModalSize = "lg" | "md" | "sm"

type Props = {
  open: boolean
  onClose: () => void
  modalTitle: string
  description?: ReactNode
  ariaDescribedBy?: string
  ariaDescribedby?: string
  size?: ModalSize
  contentClassName?: string
  children: ReactNode
} & Omit<
  ComponentPropsWithoutRef<typeof Dialog.Content>,
  "children" | "title" | "aria-describedby" | "onOpenChange"
>

export const Modal = ({
  size = "md",
  modalTitle,
  description,
  ariaDescribedBy,
  ariaDescribedby,
  onClose,
  children,
  className,
  contentClassName,
  open,
  ...contentProps
}: Props) => {
  const generatedDescriptionId = useId()
  const descriptionId = ariaDescribedBy ?? ariaDescribedby ?? generatedDescriptionId

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content
          {...contentProps}
          className={clsx(styles.content, styles[size], className, contentClassName)}
          aria-describedby={description ? descriptionId : (ariaDescribedBy ?? ariaDescribedby)}
        >
          <div className={styles.header}>
            <Dialog.Title className={clsx(styles.title, "h1")}>{modalTitle}</Dialog.Title>

            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Close" type="button">
                <Icon name="closeOutline" />
              </button>
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description id={descriptionId} className={styles.description}>
              {description}
            </Dialog.Description>
          )}

          <div className={styles.mainContent}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
