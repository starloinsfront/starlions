import clsx from "clsx"

import s from "./PostAvatar.module.css"

type Props = {
  className?: string
  label: string
  size?: "lg" | "md" | "sm"
}

export const PostAvatar = ({ className, label, size = "md" }: Props) => {
  return (
    <span aria-hidden="true" className={clsx(s.avatar, s[size], className)}>
      {label}
    </span>
  )
}
