import { Icon } from "@/common/components/Icon/Icon"
import styles from "./CropOptionsPanel.module.css"

export type AspectRatioOption = {
  id: string
  label: string
  /** CSS aspect ratio for shape indicator (width/height). null = use imageOutline icon */
  shape: number | null
  value: number | null
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "original", label: "Оригинал", shape: null, value: null },
  { id: "1-1", label: "1:1", shape: 1, value: 1 },
  { id: "4-5", label: "4:5", shape: 4 / 5, value: 0.8 },
  { id: "16-9", label: "16:9", shape: 16 / 9, value: 1.777 },
]

type CropOptionsPanelProps = {
  selectedOptionId: string
  onSelect: (option: AspectRatioOption) => void
}

export const CropOptionsPanel = ({ selectedOptionId, onSelect }: CropOptionsPanelProps) => {
  return (
    <div className={styles.panel}>
      {ASPECT_RATIOS.map((option) => {
        const isSelected = option.id === selectedOptionId
        return (
          <button
            key={option.id}
            type="button"
            className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
            onClick={() => onSelect(option)}
          >
            <span className={styles.label}>{option.label}</span>
            {option.shape === null ? (
              <Icon
                name="imageOutline"
                width={24}
                height={24}
                className={isSelected ? styles.iconSelected : ""}
              />
            ) : (
              <span
                className={`${styles.shapeIcon} ${isSelected ? styles.shapeIconSelected : ""}`}
                style={{ aspectRatio: `${option.shape}` }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
