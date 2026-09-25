import type { ComponentPropsWithoutRef } from "react"
import clsx from "clsx"

import s from "./Skeleton.module.css"

type Props = ComponentPropsWithoutRef<"span">

export const Skeleton = ({ className, ...props }: Props) => {
  return <span {...props} aria-hidden="true" className={clsx(s.root, className)} />
}
