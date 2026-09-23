export const MIN_PROFILE_AGE = 13

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export const parseDateOnly = (value: string): Date | null => {
  const match = DATE_ONLY_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

export const isAtLeastAge = (
  value: string,
  minimumAge = MIN_PROFILE_AGE,
  today = new Date(),
): boolean => {
  const birthDate = parseDateOnly(value)

  if (!birthDate) {
    return false
  }

  const latestAllowedBirthDate = new Date(
    today.getFullYear() - minimumAge,
    today.getMonth(),
    today.getDate(),
  )

  return birthDate <= latestAllowedBirthDate
}

export const isUnderMinimumAge = (value: string): boolean => {
  return Boolean(parseDateOnly(value)) && !isAtLeastAge(value)
}
