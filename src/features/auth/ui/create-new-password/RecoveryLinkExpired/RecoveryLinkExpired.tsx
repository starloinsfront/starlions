import Image from "next/image"
import styles from "./RecoveryLinkExpired.module.css"
import { Button } from "@/common/components/Button/Button"
import Link from "next/link"
import { ROUTES } from "@/common/constants/route"

export const RecoveryLinkExpired = () => {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Email verification link expired</h1>

      <p className={styles.description}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/auth/email-link-expired.svg"
          alt="Email verification link expired"
          width={0}
          height={0}
          className={styles.image}
          style={{ width: "100%", height: "auto" }}
          loading="eager"
        />
      </div>

      <Button className={styles.button} asChild>
        <Link href={ROUTES.forgotPassword}>Resend link</Link>
      </Button>
    </div>
  )
}
