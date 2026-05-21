import { ROUTES } from "@/common/constants/route"
import type { SidebarSection } from "./sidebar.types"

export const sidebarSections: SidebarSection = {
  main: [
    { title: "Feed", href: ROUTES.feed, icon: "homeOutline" },
    { title: "Create", href: ROUTES.create, icon: "addOutline" },
    { title: "My Profile", href: ROUTES.profile, icon: "personOutline" },
    { title: "Messenger", href: ROUTES.messenger, icon: "emailOutline" },
    { title: "Search", href: ROUTES.search, icon: "searchOutline" },
  ],
  secondary: [
    { title: "Profile Settings", href: ROUTES.settings, icon: "settingsOutline" },
    { title: "Statistics", href: ROUTES.statistics, icon: "trendingUpFilled" },
    { title: "Favorites", href: ROUTES.favorites, icon: "bookmarkOutline" },
  ],
}
