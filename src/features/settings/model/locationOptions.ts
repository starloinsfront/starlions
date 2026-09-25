import type { SelectOption } from "@/common/components/Select/customSelect.types"

export const withSelectedOption = (
  options: SelectOption[],
  selectedValue: string | null | undefined,
  selectedLabel: string | null | undefined,
): SelectOption[] => {
  if (!selectedValue || !selectedLabel) {
    return options
  }

  if (options.some((option) => option.value === selectedValue)) {
    return options
  }

  return [{ label: selectedLabel, value: selectedValue }, ...options]
}
