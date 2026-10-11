"use client"

import { useEffect, useId, useState } from "react"

import { Button } from "@/common/components/Button/Button"
import { Modal } from "@/common/components/Modal/Modal"

import s from "./PaymentAutoRenewalModal.module.css"

export const AUTO_RENEWAL_PAYMENT_MESSAGE =
  "Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings"

type Props = {
  isConfirming?: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export const PaymentAutoRenewalModal = ({
  isConfirming = false,
  isOpen,
  onClose,
  onConfirm,
}: Props) => {
  const checkboxId = useId()
  const [isAgreed, setIsAgreed] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsAgreed(false)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    if (!isAgreed || isConfirming) {
      return
    }

    await onConfirm()
  }

  return (
    <Modal
      contentClassName={s.content}
      headerClassName={s.header}
      modalTitle="Create payment"
      onClose={onClose}
      open={isOpen}
      size="xs"
    >
      <p className={s.message}>{AUTO_RENEWAL_PAYMENT_MESSAGE}</p>

      <div className={s.footer}>
        <label className={s.consentLabel} htmlFor={checkboxId}>
          <input
            checked={isAgreed}
            className={s.consentCheckbox}
            id={checkboxId}
            onChange={(event) => setIsAgreed(event.target.checked)}
            type="checkbox"
          />
          <span className={s.consentText}>Agree</span>
        </label>

        <Button
          disabled={!isAgreed || isConfirming}
          isLoading={isConfirming}
          onClick={() => void handleConfirm()}
          type="button"
        >
          OK
        </Button>
      </div>
    </Modal>
  )
}
