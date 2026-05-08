"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from "react"

import styles from "./Dropdown.module.css"

type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
type DropdownMenuRootProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: DropdownMenuContentProps["align"]
  side?: DropdownMenuContentProps["side"]
  sideOffset?: DropdownMenuContentProps["sideOffset"]
  alignOffset?: DropdownMenuContentProps["alignOffset"]
  collisionPadding?: DropdownMenuContentProps["collisionPadding"]
  avoidCollisions?: DropdownMenuContentProps["avoidCollisions"]
  contentClassName?: string
  className?: string
  modal?: DropdownMenuRootProps["modal"]
  open?: DropdownMenuRootProps["open"]
  onOpenChange?: DropdownMenuRootProps["onOpenChange"]
}

export const Dropdown = ({
  trigger,
  children,
  align = "end",
  side = "bottom",
  sideOffset = 8,
  alignOffset = 0,
  collisionPadding = 16,
  avoidCollisions = true,
  contentClassName,
  className,
  modal = true,
  open,
  onOpenChange,
}: DropdownProps) => {
  return (
    <DropdownMenuPrimitive.Root modal={modal} open={open} onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={clsx(styles.content, contentClassName, className)}
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          avoidCollisions={avoidCollisions}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "danger"
  unstyled?: boolean
}

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, variant = "default", unstyled = false, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={clsx(!unstyled && styles.item, className)}
      data-variant={variant}
      {...props}
    />
  )
})

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={clsx(styles.separator, className)}
      {...props}
    />
  )
})

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label ref={ref} className={clsx(styles.label, className)} {...props} />
  )
})

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

type DropdownMenuArrowProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>

export const DropdownMenuArrow = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Arrow>,
  DropdownMenuArrowProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Arrow ref={ref} className={clsx(styles.arrow, className)} {...props} />
  )
})

DropdownMenuArrow.displayName = DropdownMenuPrimitive.Arrow.displayName

export const DropdownMenuGroup = DropdownMenuPrimitive.Group
