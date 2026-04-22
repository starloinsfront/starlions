"use client"

import { useState } from "react"

import { IconButton } from "@/common/components/IconButton/IconButton"

import "./page.css"

export const Page = () => {
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <IconButton
        activeIconName="addFilled"
        color="var(--accent-500)"
        iconName="addOutline"
        isActive={isActive}
        onClick={() => setIsActive((prev) => !prev)}
      >
        Add
      </IconButton>

      <IconButton
        activeIconName="personFilled"
        iconName="personOutline"
        isActive={isActive}
        onClick={() => setIsActive((prev) => !prev)}
      >
        Profile
      </IconButton>
    </>
  )
}
