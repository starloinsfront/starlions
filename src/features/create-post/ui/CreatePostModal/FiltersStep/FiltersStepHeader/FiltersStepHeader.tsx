import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./FiltersStepHeader.module.css"

type FiltersStepHeaderProps = {
  onBack: () => void
  onNext: () => void
}

export const FiltersStepHeader = ({ onBack, onNext }: FiltersStepHeaderProps) => {
  return (
    <div className={styles.header}>
      <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
        <Icon name="arrowBackOutline" width={24} height={24} />
      </button>

      <Dialog.Title className={styles.title}>Filters</Dialog.Title>

      <button className={styles.nextButton} type="button" onClick={onNext}>
        Next
      </button>
    </div>
  )
}
