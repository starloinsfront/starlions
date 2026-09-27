export const normalizeCountryCode = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.trim().toUpperCase()

  return normalized.length === 2 ? normalized : null
}

export const normalizeCityId = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const normalized = Number(value)

  return Number.isSafeInteger(normalized) && normalized > 0 ? normalized : null
}
