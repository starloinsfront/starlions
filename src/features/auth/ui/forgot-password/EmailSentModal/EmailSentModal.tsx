import clsx from "clsx"

import { Button } from "@/common/components/Button/Button"
import { Modal } from "@/common/components/Modal/Modal"

import styles from "./EmailSentModal.module.css"

type Props = {
  open: boolean
  email: string
  onClose: () => void
}

export const EmailSentModal = ({ open, email, onClose }: Props) => {
  return (
    <Modal modalTitle="Email sent" onClose={onClose} open={open} size="sm">
      <div className={styles.dialog}>
        <p className={clsx("regularText16", styles.description)}>
          We have sent a link to confirm your email to {email}
        </p>

        <Button onClick={onClose}>OK</Button>
      </div>
    </Modal>
  )
}
