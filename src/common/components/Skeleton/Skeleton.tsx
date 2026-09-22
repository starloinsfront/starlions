import clsx from "clsx"

import s from "./Skeleton.module.css"

type Props = {
  className?: string
}

export const Skeleton = ({ className }: Props) => {
  return <span aria-hidden="true" className={clsx(s.root, className)} />
}
