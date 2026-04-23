import { SidebarSection } from "./sidebar.types"

export const sidebarSections: SidebarSection = {
  main: [
    { title: "Feed", href: "/feed", icon: "homeOutline" },
    { title: "Create", href: "/create", icon: "addOutline" },
    { title: "My Profile", href: "/profile", icon: "personOutline" },
    { title: "Messenger", href: "/messenger", icon: "homeOutline" },
    { title: "Search", href: "/search", icon: "homeOutline" },
  ],
  secondary: [
    { title: "Statistics", href: "/statistics", icon: "homeOutline" },
    { title: "Favorites", href: "/favorites", icon: "homeOutline" },
  ],
}
