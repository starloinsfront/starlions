import { IconName } from "@/common/components/Icon/IconNameType"

export type SidebarAction = "create"

export type SidebarLink = {
  title: string
  href: string
  icon: IconName
  disabled?: boolean
  action?: SidebarAction
}

export type SidebarSection = {
  main?: SidebarLink[]
  secondary?: SidebarLink[]
}
