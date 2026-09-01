import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./PublicationStepHeader.module.css"

type PublicationStepHeaderProps = {
  onBack: () => void
  onPublish: () => void
  isPublishing?: boolean
  variant?: "desktop" | "mobile"
}

export const PublicationStepHeader = ({
  onBack,
  onPublish,
  isPublishing = false,
  variant = "desktop",
}: PublicationStepHeaderProps) => {
  const headerClass = variant === "mobile" ? `${styles.header} ${styles.headerMobile}` : styles.header

  return (
    <div className={headerClass}>
      <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
        <Icon name="arrowBackOutline" width={24} height={24} />
      </button>

      <Dialog.Title className={styles.title}>Publication</Dialog.Title>

      <button
        className={styles.publishButton}
        type="button"
        onClick={onPublish}
        disabled={isPublishing}
      >
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
    </div>
  )
}
