import { useEffect, useRef } from "react"

type Options = {
  enabled?: boolean
  rootMargin?: string
}

export const useIntersectionObserver = (callback: () => void, options?: Options) => {
  const targetRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!options?.enabled) return

    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callbackRef.current()
        }
      },
      { rootMargin: options?.rootMargin ?? "200px" },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [options?.enabled, options?.rootMargin])

  return targetRef
}
