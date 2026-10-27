import { ROUTES } from "@/common/constants/route"

import type { SidebarLink } from "./sidebar.types"

export const resolveSidebarHref = (link: SidebarLink, meId?: string) => {
  if (link.title === "Profile Settings") {
    return meId ? ROUTES.settings(meId) : null
  }

  return link.href
}
