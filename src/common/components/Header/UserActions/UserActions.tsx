import { Icon } from "../../Icon/Icon"
import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import s from "./UserActions.module.css"

export function UserActions() {
  return (
    <>
      <button className={s.iconButton}>
        <Icon name="bookmarkOutline" />
        <span>1</span>
      </button>
      <LanguageSelect />
    </>
  )
}
