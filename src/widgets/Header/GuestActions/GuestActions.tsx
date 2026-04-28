import Link from "next/link"
import { Button } from "@/common/components/Button/Button"
import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import styles from "./GuestActions.module.css"
import { ROUTES } from "@/common/constants/route"

export function GuestActions() {
  return (
    <>
      <LanguageSelect />
      <div className={styles.linkBox}>
        <Button variant="link" className={styles.linkBtn} asChild>
          <Link href={ROUTES.signIn}>Sign in</Link>
        </Button>
        <Button className={styles.linkBtn} asChild>
          <Link href={ROUTES.signUp}>Sign up</Link>
        </Button>
      </div>
    </>
  )
}
