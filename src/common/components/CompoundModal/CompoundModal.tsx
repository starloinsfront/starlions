"use client"

import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { forwardRef } from "react"
import styles from "./CompoundModal.module.css"
import { Icon } from "../Icon/Icon"
import type {
  CompoundModalRootProps,
  CompoundModalPortalProps,
  CompoundModalOverlayProps,
  CompoundModalContentProps,
  CompoundModalHeaderProps,
  CompoundModalTitleProps,
  CompoundModalDescriptionProps,
  CompoundModalCloseProps,
  CompoundModalMainContentProps,
} from "./compoundModal.types"

export const Root = ({ children, ...props }: CompoundModalRootProps) => (
  <Dialog.Root {...props}>{children}</Dialog.Root>
)

export const Portal = ({ children }: CompoundModalPortalProps) => (
  <Dialog.Portal>{children}</Dialog.Portal>
)

export const Overlay = ({ className }: CompoundModalOverlayProps) => (
  <Dialog.Overlay className={clsx(styles.overlay, className)} />
)

export const Content = forwardRef<HTMLDivElement, CompoundModalContentProps>(
  ({ children, size = "md", className, contentClassName, ...props }, ref) => (
    <Dialog.Content
      ref={ref}
      className={clsx(styles.content, styles[size], className, contentClassName)}
      {...props}
    >
      {children}
    </Dialog.Content>
  ),
)
Content.displayName = "CompoundModal.Content"

export const Header = ({ children, className }: CompoundModalHeaderProps) => (
  <div className={clsx(styles.header, className)}>{children}</div>
)

export const Title = ({ children, className }: CompoundModalTitleProps) => (
  <Dialog.Title className={clsx(styles.title, "h1", className)}>{children}</Dialog.Title>
)

export const Description = ({ children, id, className }: CompoundModalDescriptionProps) => (
  <Dialog.Description id={id} className={clsx(styles.description, className)}>
    {children}
  </Dialog.Description>
)

export const Close = ({ className }: CompoundModalCloseProps) => (
  <Dialog.Close asChild>
    <button className={clsx(styles.iconButton, className)} aria-label="Close" type="button">
      <Icon name="closeOutline" />
    </button>
  </Dialog.Close>
)

export const MainContent = ({ children, className }: CompoundModalMainContentProps) => (
  <div className={clsx(styles.mainContent, className)}>{children}</div>
)

export const CompoundModal = {
  Root,
  Portal,
  Overlay,
  Content,
  Header,
  Title,
  Description,
  Close,
  MainContent,
}
