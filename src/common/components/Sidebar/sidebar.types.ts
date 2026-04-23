import { IconName } from "../Icon/Icon"

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
