import { Button } from "../../Button/Button"
import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import s from "./GuestActions.module.css"

export function GuestActions() {
  return (
    <>
      <LanguageSelect />
      <div className={s.linkBox}>
        <Button variant="link">Log in</Button>
        <Button>Sign up</Button>
      </div>
    </>
  )
}
