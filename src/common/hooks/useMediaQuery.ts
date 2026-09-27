"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * SSR-safe media query hook without external dependencies.
 *
 * The hook uses the modern MediaQueryList event API only.
 * Deprecated addListener/removeListener are intentionally not used, because
 * TypeScript marks them as deprecated and modern supported browsers expose
 * addEventListener/removeEventListener for MediaQueryList.
 */
export const useMediaQuery = (query: string, defaultValue = false) => {
  const getMediaQueryList = useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return null
    }

    return window.matchMedia(query)
  }, [query])

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = getMediaQueryList()

      if (!mediaQueryList) {
        return () => {}
      }

      const handleChange = () => onStoreChange()

      mediaQueryList.addEventListener("change", handleChange)

      return () => mediaQueryList.removeEventListener("change", handleChange)
    },
    [getMediaQueryList],
  )

  const getSnapshot = useCallback(() => {
    return getMediaQueryList()?.matches ?? defaultValue
  }, [defaultValue, getMediaQueryList])

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
