import { Icon } from "@/common/components/Icon/Icon"
import s from "./MobileCroppingHeader.module.css"

type MobileCroppingHeaderProps = {
  onBack: () => void
  onNext: () => void
  isNextDisabled?: boolean
}

export const MobileCroppingHeader = ({ onBack, onNext, isNextDisabled }: MobileCroppingHeaderProps) => {
  return (
    <div className={s.header}>
      <button
        className={s.backButton}
        type="button"
        aria-label="Go back"
        onClick={onBack}
      >
        <Icon name="arrowBackOutline" width={24} height={24} />
      </button>
      <span className={s.title}>Cropping</span>
      <button
        className={s.nextButton}
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  )
}
