import { useCallback, useEffect, useMemo, useState } from "react"

type UseRateLimitCooldownParams = {
  storageKey: string
}

const getSavedCooldownUntil = (storageKey: string) => {
  if (typeof window === "undefined") {
    return 0
  }

  const savedValue = localStorage.getItem(storageKey)
  const parsedValue = savedValue ? Number(savedValue) : 0

  return Number.isFinite(parsedValue) ? parsedValue : 0
}

/**
 * Persistent cooldown for rate-limit errors.
 *
 * Stores cooldown end timestamp in localStorage, so the timer survives
 * page transitions and browser tab reopening.
 */
export const useRateLimitCooldown = ({ storageKey }: UseRateLimitCooldownParams) => {
  const [cooldownUntil, setCooldownUntil] = useState(() => getSavedCooldownUntil(storageKey))
  const [now, setNow] = useState(() => Date.now())

  const cooldown = useMemo(() => {
    const secondsLeft = Math.ceil((cooldownUntil - now) / 1000)

    return Math.max(secondsLeft, 0)
  }, [cooldownUntil, now])

  const isCooldownActive = cooldown > 0

  useEffect(() => {
    if (!isCooldownActive) {
      localStorage.removeItem(storageKey)

      return
    }

    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [isCooldownActive, storageKey])

  const startCooldown = useCallback(
    (seconds: number) => {
      if (seconds <= 0) {
        return
      }

      const nextCooldownUntil = Date.now() + seconds * 1000

      localStorage.setItem(storageKey, String(nextCooldownUntil))
      setCooldownUntil(nextCooldownUntil)
      setNow(Date.now())
    },
    [storageKey],
  )

  const resetCooldown = useCallback(() => {
    localStorage.removeItem(storageKey)
    setCooldownUntil(0)
    setNow(Date.now())
  }, [storageKey])

  return {
    cooldown,
    isCooldownActive,
    startCooldown,
    resetCooldown,
  }
}
