import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./CroppingStep.module.css"
import type { CroppingStepProps } from "./CroppingStep.types"

export const CroppingStep = ({ imageUrl, onBack, onNext }: CroppingStepProps) => {
  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
          <Icon name="arrowBackOutline" width={24} height={24} />
        </button>

        <Dialog.Title className={styles.title}>Cropping</Dialog.Title>

        <button className={styles.nextButton} type="button" onClick={onNext}>
          Next
        </button>
      </div>

      <div className={styles.imageArea}>
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
        <img src={imageUrl} alt="Photo being cropped" className={styles.image} />

        <div className={styles.toolbar}>
          <div className={styles.toolbarGroup}>
            <button className={styles.toolButton} type="button" aria-label="Crop">
              <Icon name="expandOutline" width={24} height={24} />
            </button>
            <button className={styles.toolButton} type="button" aria-label="Zoom">
              <Icon name="maximizeOutline" width={24} height={24} />
            </button>
          </div>

          <button className={styles.toolButton} type="button" aria-label="Gallery">
            <Icon name="imageOutline" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
