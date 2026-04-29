import styles from "./ForgotPassword.module.css"
import { ForgotPasswordForm } from "./ForgotPasswordForm/ForgotPasswordForm"

export const ForgotPassword = () => {
  return (
    <section className={styles.section}>
      <ForgotPasswordForm />
    </section>
  )
}
