import s from "./RegisteredUsers.module.css"

export const RegisteredUsers = () => {
  const digits = ["0", "0", "9", "2", "1", "3"]

  return (
    <section aria-label="Registered users" className={s.section}>
      <div className={s.counter}>
        <p className={s.label}>Registered users:</p>
        <div aria-label="Registered users count 009213" className={s.digits}>
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
