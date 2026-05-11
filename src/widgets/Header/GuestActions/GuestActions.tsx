"use client"

import { Button } from "@/common/components/Button/Button"
import { DropdownMenuItem } from "@/common/components/DropdownMenu/DropdownMenu"
import { MoreActionsDropdown } from "@/common/components/MoreActionsDropdown/MoreActionsDropdown"
import { ROUTES } from "@/common/constants/route"
import Link from "next/link"
import { LanguageSelect } from "../LanguageSelect/LanguageSelect"
import styles from "./GuestActions.module.css"

export function GuestActions() {
  return (
    <>
      <LanguageSelect />
      <div className={styles.linkBox}>
        <div className={styles.desktop}>
          <Button variant="link" className={styles.linkBtn} asChild>
            <Link href={ROUTES.signIn}>Sign in</Link>
          </Button>
          <Button className={styles.linkBtn} asChild>
            <Link href={ROUTES.signUp}>Sign up</Link>
          </Button>
        </div>
        <div className={styles.mobile}>
          <MoreActionsDropdown>
            <DropdownMenuItem key={ROUTES.signIn} asChild unstyled>
              <Button variant="link" asChild>
                <Link href={ROUTES.signIn}>Sign in</Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem key={ROUTES.signUp} asChild unstyled>
              <Button asChild>
                <Link href={ROUTES.signUp}>Sign up</Link>
              </Button>
            </DropdownMenuItem>
          </MoreActionsDropdown>
        </div>
      </div>
    </>
  )
}
