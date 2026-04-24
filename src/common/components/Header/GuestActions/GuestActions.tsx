import { Button } from "../../Button/Button"
import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import styles from "./GuestActions.module.css"

export function GuestActions() {
  return (
    <>
      <LanguageSelect />
      <div className={styles.linkBox}>
        <Button variant="link" className={styles.linkBtn}>
          Log in
        </Button>
        <Button className={styles.linkBtn}>Sign up</Button>
      </div>
    </>
  )
}
