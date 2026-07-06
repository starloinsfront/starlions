import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./PublicationStepHeader.module.css"

type PublicationStepHeaderProps = {
  onBack: () => void
  onPublish: () => void
  isPublishing?: boolean
  imageSrc?: string
}

export const PublicationStepHeader = ({
  onBack,
  onPublish,
  isPublishing = false,
  imageSrc,
}: PublicationStepHeaderProps) => {
  return (
    <div className={styles.header}>
      <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
        <Icon name="arrowBackOutline" width={24} height={24} />
      </button>

      {imageSrc && (
        /* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */
        <img src={imageSrc} alt="Post preview" className={styles.headerImage} />
      )}

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
