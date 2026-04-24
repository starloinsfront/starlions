import { IconName } from "../Icon/IconNameType"

export type SidebarLink = {
  title: string
  href: string
  icon: IconName
  disabled?: boolean
}

export type SidebarSection = {
  main?: SidebarLink[]
  secondary?: SidebarLink[]
}
