export const getUserInitials = (username: string) => {
  const normalizedUsername = username.trim()

  if (!normalizedUsername) {
    return "U"
  }

  const parts = normalizedUsername
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
