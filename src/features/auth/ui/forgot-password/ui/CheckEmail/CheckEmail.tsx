import styles from "./CheckEmail.module.css"
import { CheckEmailForm } from "./CheckEmailForm/CheckEmailForm"

export const CheckEmail = () => {
  return (
    <section className={styles.section}>
      <CheckEmailForm />
    </section>
  )
}
