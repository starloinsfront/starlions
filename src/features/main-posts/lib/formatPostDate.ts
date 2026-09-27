const MINUTE_IN_MS = 60 * 1000
const HOUR_IN_MS = 60 * MINUTE_IN_MS
const DAY_IN_MS = 24 * HOUR_IN_MS

const getPlural = (value: number, one: string, many: string) => {
  return value === 1 ? one : many
}

export const formatRelativeTime = (createdAt: string, now = Date.now()) => {
  const timestamp = new Date(createdAt).getTime()

  if (Number.isNaN(timestamp)) {
    return "recently"
  }

  const diff = Math.max(now - timestamp, 0)

  if (diff < HOUR_IN_MS) {
    const minutes = Math.max(Math.floor(diff / MINUTE_IN_MS), 1)

    return `${minutes} ${getPlural(minutes, "min", "min")} ago`
  }

  if (diff < DAY_IN_MS) {
    const hours = Math.floor(diff / HOUR_IN_MS)

    return `${hours} ${getPlural(hours, "hour", "hours")} ago`
  }

  const days = Math.floor(diff / DAY_IN_MS)

  if (days < 30) {
    return `${days} ${getPlural(days, "day", "days")} ago`
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt))
}

export const formatPostDate = (createdAt: string) => {
  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}
