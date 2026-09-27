"use client"

import { useMediaQuery } from "@/common/hooks/useMediaQuery"

export const POST_MOBILE_MEDIA_QUERY = "(max-width: 768px)"
export const POST_TABLET_MEDIA_QUERY = POST_MOBILE_MEDIA_QUERY

export const usePostLayoutMode = () => {
  const isMobile = useMediaQuery(POST_MOBILE_MEDIA_QUERY)
  const isTablet = false

  return {
    isDesktop: !isMobile,
    isMobile,
    isTablet,
  }
}
