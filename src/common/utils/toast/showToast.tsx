import { toast } from "sonner"

export type ToastMessage = string | string[]

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <span>
      <strong>Error!</strong> {message}
    </span>
  )
}

const showMessages = (message: ToastMessage, show: (message: string) => string | number) => {
  if (Array.isArray(message)) {
    message.forEach((item) => {
      show(item)
    })

    return
  }

  show(message)
}

export const showErrorToast = (message: ToastMessage) => {
  if (Array.isArray(message)) {
    message.forEach((item) => {
      toast.error(<ErrorMessage message={item} />)
    })

    return
  }

  toast.error(<ErrorMessage message={message} />)
}

export const showSuccessToast = (message: ToastMessage) => {
  showMessages(message, toast.success)
}

export const showWarningToast = (message: ToastMessage) => {
  showMessages(message, toast.warning)
}

export const showInfoToast = (message: ToastMessage) => {
  showMessages(message, toast.info)
}
