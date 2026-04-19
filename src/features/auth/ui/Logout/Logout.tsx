type Props = {
  onClick?: () => void
}

export const Logout = ({ onClick }: Props) => {
  return (
    <button type="button" onClick={onClick}>
      Logout
    </button>
  )
}
