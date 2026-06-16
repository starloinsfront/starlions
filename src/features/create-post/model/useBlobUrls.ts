import { useCallback, useEffect, useRef } from "react"

/**
 * Manages blob URL lifecycle: creation, revocation, and cleanup on unmount.
 * Tracks all created URLs in a Set to prevent memory leaks.
 */
export const useBlobUrls = () => {
  const blobUrlsRef = useRef<Set<string>>(new Set())

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    const urls = blobUrlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const createBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file)
    blobUrlsRef.current.add(url)
    return url
  }, [])

  const revokeBlobUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url)
    blobUrlsRef.current.delete(url)
  }, [])

  /** Track an externally created blob URL for cleanup. */
  const trackBlobUrl = useCallback((url: string) => {
    blobUrlsRef.current.add(url)
  }, [])

  /** Revoke all tracked blob URLs and clear the set. */
  const revokeAllBlobUrls = useCallback(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    blobUrlsRef.current.clear()
  }, [])

  return {
    blobUrlsRef,
    createBlobUrl,
    revokeBlobUrl,
    trackBlobUrl,
    revokeAllBlobUrls,
  }
}
