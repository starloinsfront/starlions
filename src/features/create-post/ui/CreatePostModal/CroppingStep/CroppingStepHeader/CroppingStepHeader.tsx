import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./CroppingStepHeader.module.css"

type CroppingStepHeaderProps = {
  onBack: () => void
  onNext: () => void
  isNextDisabled?: boolean
  variant?: "desktop" | "mobile"
}

export const CroppingStepHeader = ({
  onBack,
  onNext,
  isNextDisabled = false,
  variant = "desktop",
}: CroppingStepHeaderProps) => {
  const headerClass = variant === "mobile" ? `${styles.header} ${styles.headerMobile}` : styles.header

  return (
    <div className={headerClass}>
      <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
        <Icon name="arrowBackOutline" width={24} height={24} />
      </button>

      <Dialog.Title className={styles.title}>Cropping</Dialog.Title>

      <button
        className={styles.nextButton}
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  )
}
