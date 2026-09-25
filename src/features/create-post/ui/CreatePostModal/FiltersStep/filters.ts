/**
 * CSS filter presets inspired by popular social-media filters.
 * Each value is a valid CSS `filter` string applied via inline style.
 */

export type FilterPreset = {
  id: string
  label: string
  /** CSS filter string, or "none" for unfiltered. */
  value: string
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: "normal", label: "Normal", value: "none" },
  { id: "clarendon", label: "Clarendon", value: "contrast(1.2) saturate(1.35)" },
  { id: "lark", label: "Lark", value: "brightness(1.1) contrast(0.9) saturate(1.2)" },
  { id: "gingham", label: "Gingham", value: "brightness(1.05) hue-rotate(-10deg) saturate(0.85)" },
  { id: "moon", label: "Moon", value: "grayscale(1) brightness(1.1) contrast(1.1)" },
  { id: "reyes", label: "Reyes", value: "sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)" },
  { id: "juno", label: "Juno", value: "contrast(1.15) saturate(1.8) sepia(0.08)" },
  { id: "slumber", label: "Slumber", value: "saturate(0.66) brightness(1.05) contrast(0.9)" },
  { id: "crema", label: "Crema", value: "sepia(0.35) brightness(1.1) contrast(0.9) saturate(1.15)" },
]
