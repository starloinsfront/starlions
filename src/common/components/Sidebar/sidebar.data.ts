import { SidebarSection } from "./sidebar.types"

export const sidebarSections: SidebarSection = {
  main: [
    { title: "Feed", href: "/feed", icon: "#" },
    { title: "Create", href: "/create", icon: "#" },
    { title: "My Profile", href: "/profile", icon: "#" },
    { title: "Messenger", href: "/messenger", icon: "#" },
    { title: "Search", href: "/search", icon: "#" },
  ],
  secondary: [
    { title: "Statistics", href: "/statistics", icon: "#" },
    { title: "Favorites", href: "/favorites", icon: "#" },
  ],
}
