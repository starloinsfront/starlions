import Image from "next/image"
import { ReactNode } from "react"
import styles from "./AuthLinkExpired.module.css"

export const AuthLinkExpired = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Email verification link expired</h1>

      <p className={styles.description}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/auth/recovery-link-expired.svg"
          alt="Email verification link expired"
          width={0}
          height={0}
          className={styles.image}
          style={{ width: "100%", height: "auto" }}
          loading="eager"
        />
      </div>

      <div className={styles.children}>{children}</div>
    </div>
  )
}
