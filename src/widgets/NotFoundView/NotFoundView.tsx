import Link from "next/link"

import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"

import styles from "./NotFoundView.module.css"

import { NotFoundBackButton } from "./NotFoundBackButton"

type Props = {
  description?: string
  label?: string
  primaryHref?: string
  primaryLabel?: string
  showBackButton?: boolean
  title?: string
}

export const NotFoundView = ({
  description = "The page you are looking for may have been moved, deleted, or the link may be incorrect.",
  label = "Page not found",
  primaryHref = ROUTES.home,
  primaryLabel = "Back to Home",
  showBackButton = false,
  title = "Oops! This page does not exist",
}: Props) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <span className={styles.code} aria-hidden="true">
          404
        </span>

        <div className={styles.card}>
          <p className={styles.label}>{label}</p>

          <h1 className={styles.title}>{title}</h1>

          <p className={styles.description}>{description}</p>

          <div className={styles.actions}>
            {showBackButton ? <NotFoundBackButton /> : null}

            <Button className={styles.button} asChild>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
