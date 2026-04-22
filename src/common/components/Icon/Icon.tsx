import type { ComponentPropsWithoutRef } from "react"

export type IconName =
  | "addFilled"
  | "addOutline"
  | "homeFilled"
  | "homeOutline"
  | "personFilled"
  | "personOutline"

type Props = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  name: IconName
}

export const Icon = ({ name, width = 24, height = 24, className, ...props }: Props) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      height={height}
      width={width}
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  )
}
