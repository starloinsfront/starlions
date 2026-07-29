"use client"

import { useMediaQuery } from "@/common/hooks/useMediaQuery"

export const POST_MOBILE_MEDIA_QUERY = "(max-width: 768px)"
export const POST_TABLET_MEDIA_QUERY = "(max-width: 1024px)"

export const usePostLayoutMode = () => {
  const isMobile = useMediaQuery(POST_MOBILE_MEDIA_QUERY)
  const isTabletOrMobile = useMediaQuery(POST_TABLET_MEDIA_QUERY)

  return {
    isDesktop: !isTabletOrMobile,
    isMobile,
    isTablet: isTabletOrMobile && !isMobile,
    isTabletOrMobile,
  }
}
