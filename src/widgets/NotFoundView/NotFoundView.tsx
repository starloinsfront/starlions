import Link from "next/link"

import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"

import styles from "./NotFoundView.module.css"

export const NotFoundView = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <span className={styles.code} aria-hidden="true">
          404
        </span>

        <div className={styles.card}>
          <p className={styles.label}>Page not found</p>

          <h1 className={styles.title}>Oops! This page does not exist</h1>

          <p className={styles.description}>
            The page you are looking for may have been moved, deleted, or the link may be incorrect.
          </p>

          <Button className={styles.button} asChild>
            <Link href={ROUTES.home}>Back to Home</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
