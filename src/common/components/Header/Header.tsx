"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./Header.module.css"

const languages = [
  { code: "en", label: "English", icon: "flagUnitedKingdomFilled" },
  { code: "ru", label: "Russian", icon: "flagRussiaFilled" },
] as const

type Language = (typeof languages)[number]

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link className={s.logo} href="/">
          Inctagram
        </Link>

        <div className={s.controls}>
          <div className={s.languageWrapper} ref={wrapperRef}>
            <button
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              className={s.languageButton}
              data-open={isOpen}
              onClick={() => setIsOpen(prev => !prev)}
              type="button"
            >
              <Icon className={s.flag} height={20} name={selectedLanguage.icon} width={20} />
              <span className={s.languageLabel}>{selectedLanguage.label}</span>
              <Icon className={s.arrow} height={18} name="arrowIosDownOutline" width={18} />
            </button>

            {isOpen && (
              <ul className={s.menu} role="listbox">
                {languages.map(language => (
                  <li className={s.menuItem} key={language.code}>
                    <button
                      aria-current={selectedLanguage.code === language.code}
                      className={s.menuOption}
                      onClick={() => {
                        setSelectedLanguage(language)
                        setIsOpen(false)
                      }}
                      type="button"
                    >
                      <Icon height={20} name={language.icon} width={20} />
                      <span>{language.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Authentication" className={s.auth}>
            <Link className={s.login} href="/login">
              Log in
            </Link>
            <Button className={s.signup} variant="primary">
              Sign up
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
