import { useEffect, type RefObject } from "react"

export function useClickOutside(
  panelRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return

    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Use timeout to avoid the same click that opened it from closing it
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClick)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [isOpen, onClose, panelRef])
}
