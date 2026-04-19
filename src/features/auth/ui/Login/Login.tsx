type Props = {
  onClick?: () => void
}

export const Login = ({ onClick }: Props) => {
  return (
    <button type="button" onClick={onClick}>
      Login
    </button>
  )
}
