import { ReactNode } from "react"

import styles from "./AuthPageSection.module.css"

type Props = {
  children: ReactNode
}
export const AuthPageSection = ({ children }: Props) => {
  return <section className={styles.section}>{children}</section>
}
