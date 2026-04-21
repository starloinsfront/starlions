import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import s from "./UserActions.module.css"

export function UserActions() {
  return (
    <>
      <button className={s.iconButton}>
        🔔<span>1</span>
      </button>
      <LanguageSelect />
    </>
  )
}
