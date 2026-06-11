import { Icon } from "@/common/components/Icon/Icon"
import styles from "./CroppingToolbar.module.css"

type CroppingToolbarProps = {
  isGalleryOpen: boolean
  isCropOptionsOpen: boolean
  onToggleGallery: () => void
  onToggleCropOptions: () => void
  onZoom?: () => void
}

export const CroppingToolbar = ({
  isGalleryOpen,
  isCropOptionsOpen,
  onToggleGallery,
  onToggleCropOptions,
  onZoom,
}: CroppingToolbarProps) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        <button
          className={styles.toolButton}
          type="button"
          aria-label="Crop"
          aria-pressed={isCropOptionsOpen}
          onClick={onToggleCropOptions}
        >
          <Icon
            name="expandOutline"
            width={24}
            height={24}
            style={isCropOptionsOpen ? { color: "var(--accent-500)" } : undefined}
          />
        </button>
        <button className={styles.toolButton} type="button" aria-label="Zoom" onClick={onZoom}>
          <Icon name="maximizeOutline" width={24} height={24} />
        </button>
      </div>

      <button
        className={styles.toolButton}
        type="button"
        aria-label="Gallery"
        aria-pressed={isGalleryOpen}
        onClick={onToggleGallery}
      >
        <Icon
          name="imageOutline"
          width={24}
          height={24}
          style={isGalleryOpen ? { color: "var(--accent-500)" } : undefined}
        />
      </button>
    </div>
  )
}
