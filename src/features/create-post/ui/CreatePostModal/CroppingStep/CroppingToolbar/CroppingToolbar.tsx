import { Icon } from "@/common/components/Icon/Icon"
import { ZoomControl } from "../ZoomControl/ZoomControl"
import styles from "./CroppingToolbar.module.css"

type CroppingToolbarProps = {
  isGalleryOpen: boolean
  isCropOptionsOpen: boolean
  onToggleGallery: () => void
  onToggleCropOptions: () => void
  zoomLevel: number
  isSliderVisible: boolean
  minZoom: number
  maxZoom: number
  zoomStep: number
  onToggleSlider: () => void
  onCloseSlider: () => void
  onZoomChange: (value: number[]) => void
}

export const CroppingToolbar = ({
  isGalleryOpen,
  isCropOptionsOpen,
  onToggleGallery,
  onToggleCropOptions,
  zoomLevel,
  isSliderVisible,
  minZoom,
  maxZoom,
  zoomStep,
  onToggleSlider,
  onCloseSlider,
  onZoomChange,
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

        <ZoomControl
          zoomLevel={zoomLevel}
          isSliderVisible={isSliderVisible}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomStep={zoomStep}
          onToggleSlider={onToggleSlider}
          onCloseSlider={onCloseSlider}
          onZoomChange={onZoomChange}
        />
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
