import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { MOCK_SUGGESTIONS } from "../mockSuggestions"
import type { LocationSuggestion } from "../mockSuggestions"

/**
 * Manages location autocomplete: filtering suggestions,
 * open/close state, and click-outside dismissal.
 */
export const useLocationAutocomplete = (
  location: string,
  onSelectLocation: (name: string) => void,
) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = useMemo<LocationSuggestion[]>(() => {
    if (!location.trim()) return MOCK_SUGGESTIONS
    const query = location.toLowerCase()
    return MOCK_SUGGESTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.subName.toLowerCase().includes(query),
    )
  }, [location])

  const handleFocus = useCallback(() => {
    setShowSuggestions(true)
  }, [])

  const handleSuggestionClick = useCallback(
    (name: string) => {
      onSelectLocation(name)
      setShowSuggestions(false)
    },
    [onSelectLocation],
  )

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return {
    containerRef,
    showSuggestions,
    filteredSuggestions,
    handleFocus,
    handleSuggestionClick,
  }
}
