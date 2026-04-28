import { Icon } from "@/common/components/Icon/Icon"
import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import s from "./UserActions.module.css"

export function UserActions() {
  return (
    <>
      <button className={s.iconButton}>
        <Icon name="bellOutline" width={18} hanging={20} />
        <span>1</span>
      </button>
      <LanguageSelect />
    </>
  )
}
