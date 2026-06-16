import { useCallback } from "react"
import { Modal } from "../Modal/Modal"
import styles from "./ConfirmationModal.module.css"
import { ConfirmationModalProps } from "@/common/components/ConfirmationModal/ConfirmationModalProps"

/**
 * Reusable, stateless confirmation dialog.
 *
 * Built on top of the project `Modal` (Radix Dialog).
 * Override z-index is applied so it can stack above `CreatePostModal` (1000/1001).
 *
 * Semantic mapping:
 * - **Discard** (left, text-style button) — typically the destructive / "give up" action.
 * - **Confirm** (right, filled accent button) — typically the safe / "keep" action.
 * - **Close** (X icon / overlay click) — always cancels the dialog without side-effects.
 */
export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  discardBtnText,
  confirmBtnText,
  onDiscard,
  onConfirm,
  onClose,
}: ConfirmationModalProps) => {
  const handleOverlayClick = useCallback(
    (event: Event) => {
      event.preventDefault()
      onClose()
    },
    [onClose],
  )

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      modalTitle={title}
      size="xs"
      className={styles.confirmationOverlay}
      contentClassName={styles.confirmationContent}
      headerClassName={styles.noBorderHeader}
      onPointerDownOutside={handleOverlayClick}
    >
      <p className={styles.message}>{message}</p>

      <div className={styles.actions}>
        <button type="button" className={styles.discardButton} onClick={onDiscard}>
          {discardBtnText}
        </button>
        <button type="button" className={styles.confirmButton} onClick={onConfirm}>
          {confirmBtnText}
        </button>
      </div>
    </Modal>
  )
}
