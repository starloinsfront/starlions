import clsx from "clsx"
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"
import styles from "./Modal.module.css"
import { CompoundModal } from "../CompoundModal"

type ModalSize = "lg" | "md" | "sm"

type Props = {
  open: boolean
  onClose: () => void
  modalTitle: string
  children: ReactNode
  description?: ReactNode
  ariaDescribedBy?: string
  ariaDescribedby?: string
  size?: ModalSize
  contentClassName?: string
} & Omit<
  ComponentPropsWithoutRef<typeof CompoundModal.Content>,
  "children" | "title" | "aria-describedby" | "size" | "contentClassName"
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
  const descriptionId = description
    ? (ariaDescribedBy ?? ariaDescribedby ?? generatedDescriptionId)
    : undefined

  return (
    <CompoundModal.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      <CompoundModal.Portal>
        <CompoundModal.Overlay />
        <CompoundModal.Content
          size={size}
          className={clsx(className, contentClassName)}
          aria-describedby={descriptionId ?? ariaDescribedBy ?? ariaDescribedby}
          {...contentProps}
        >
          <CompoundModal.Header>
            <CompoundModal.Title>{modalTitle}</CompoundModal.Title>
            <CompoundModal.Close />
          </CompoundModal.Header>
          {description && (
            <CompoundModal.Description id={descriptionId} className={styles.description}>
              {description}
            </CompoundModal.Description>
          )}
          <CompoundModal.MainContent>{children}</CompoundModal.MainContent>
        </CompoundModal.Content>
      </CompoundModal.Portal>
    </CompoundModal.Root>
  )
}
