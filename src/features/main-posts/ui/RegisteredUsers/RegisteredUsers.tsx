import s from "./RegisteredUsers.module.css"

type Props = {
  count: number
}

export const RegisteredUsers = ({ count }: Props) => {
  const digits = count.toString().padStart(6, "0").split("")

  return (
    <section aria-label="Registered users" className={s.section}>
      <div className={s.counter}>
        <p className={s.label}>Registered users:</p>
        <div aria-label={`Registered users count ${count}`} className={s.digits}>
          {digits.map((digit, index) => (
            <span className={s.digit} key={`${digit}-${index}`}>
              {digit}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
