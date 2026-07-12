import { Icon } from "@/common/components/Icon/Icon"
import s from "./MobilePublicationHeader.module.css"

type MobilePublicationHeaderProps = {
  onBack: () => void
  onPublish: () => void
  isPublishing?: boolean
}

export const MobilePublicationHeader = ({
  onBack,
  onPublish,
  isPublishing = false,
}: MobilePublicationHeaderProps) => {
  return (
    <div className={s.header}>
      <button
        className={s.backButton}
        type="button"
        onClick={onBack}
        aria-label="Back"
      >
        <Icon name="arrowBackOutline" width={24} height={24} />
      </button>
      <span className={s.title}>New Publication</span>
      <button
        className={s.publishButton}
        type="button"
        onClick={onPublish}
        disabled={isPublishing}
      >
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
    </div>
  )
}
