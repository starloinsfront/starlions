export type ConfirmationModalProps = {
  /** Controls modal visibility. */
  isOpen: boolean
  /** Dialog heading text. */
  title: string
  /** Warning / confirmation message (supports \n line breaks). */
  message: string
  /** Text for the left "destructive / cancel" button. */
  discardBtnText: string
  /** Text for the right "confirm / safe" button. */
  confirmBtnText: string
  /** Callback fired when the left (discard) button is clicked. */
  onDiscard: () => void
  /** Callback fired when the right (confirm) button is clicked. */
  onConfirm: () => void
  /** Callback fired when the X button or overlay is clicked. */
  onClose: () => void
}
