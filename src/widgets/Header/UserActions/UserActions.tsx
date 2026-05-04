import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import { DropdownMenuNavItem } from "./DropdownMenuNavItem/DropdownMenuNavItem"
import { MessageMenu } from "./MessageMenu/MessageMenu"

export function UserActions() {
  return (
    <>
      <MessageMenu />
      <LanguageSelect />
      <DropdownMenuNavItem />
    </>
  )
}
