import styles from "./CreateNewPassword.module.css"
import { CreateNewPasswordForm } from "./CreateNewPasswordForm/CreateNewPasswordForm"

export const CreateNewPassword = () => {
  return (
    <section className={styles.section}>
      <CreateNewPasswordForm />
    </section>
  )
}
