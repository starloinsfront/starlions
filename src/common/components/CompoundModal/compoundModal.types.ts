import { ReactNode } from "react"
import { DialogProps, DialogContentProps } from "@radix-ui/react-dialog"

export interface CompoundModalRootProps extends Omit<DialogProps, "children"> {
  children: ReactNode
}

export interface CompoundModalPortalProps {
  children: ReactNode
}

export interface CompoundModalOverlayProps {
  className?: string
}

export interface CompoundModalContentProps extends Omit<DialogContentProps, "children" | "title"> {
  children: ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
  contentClassName?: string
}

export interface CompoundModalHeaderProps {
  children: ReactNode
  className?: string
}

export interface CompoundModalTitleProps {
  children: ReactNode
  className?: string
}

export interface CompoundModalDescriptionProps {
  children: ReactNode
  id?: string
  className?: string
}

export interface CompoundModalCloseProps {
  className?: string
}

export interface CompoundModalMainContentProps {
  children: ReactNode
  className?: string
}
