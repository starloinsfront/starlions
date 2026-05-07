"use client"

import clsx from "clsx"
import { Fragment } from "react"

import {
  Dropdown,
  DropdownMenuArrow,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/common/components/Dropdown/Dropdown"
import { Icon } from "@/common/components/Icon/Icon"

import styles from "./MessageMenu.module.css"

type Notification = {
  id: string
  title: string
  text: string
  createdAt: string
  isNew?: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Новое уведомление!",
    text: "Следующий платеж у вас спишется через 1 день",
    createdAt: "1 час назад",
    isNew: true,
  },
  {
    id: "2",
    title: "Новое уведомление!",
    text: "Ваша подписка истекает через 7 дней",
    createdAt: "1 день назад",
    isNew: true,
  },
  {
    id: "3",
    title: "Новое уведомление!",
    text: "Ваша подписка истекает через 7 дней",
    createdAt: "1 день назад",
    isNew: true,
  },
  {
    id: "4",
    title: "Новое уведомление!",
    text: "Ваша подписка истекает через 7 дней",
    createdAt: "1 день назад",
  },
  {
    id: "5",
    title: "Новое уведомление!",
    text: "Ваш пароль был успешно изменен",
    createdAt: "2 дня назад",
  },
  {
    id: "6",
    title: "Новое уведомление!",
    text: "Появились новые возможности в настройках профиля",
    createdAt: "3 дня назад",
  },
]

export const MessageMenu = () => {
  const newNotificationsCount = notifications.filter((notification) => notification.isNew).length

  return (
    <Dropdown
      align="end"
      modal
      sideOffset={0}
      alignOffset={-12}
      collisionPadding={16}
      contentClassName={styles.dropdownContent}
      trigger={
        <button className={styles.iconButton} type="button" aria-label="Open notifications">
          <Icon name="bellOutline" width={24} height={24} />

          {newNotificationsCount > 0 && (
            <span className={styles.counter}>{newNotificationsCount}</span>
          )}
        </button>
      }
    >
      <DropdownMenuArrow asChild width={16} height={8}>
        <span className={styles.arrowWrap}>
          <svg
            className={styles.arrow}
            width="18"
            height="9"
            viewBox="0 0 18 9"
            aria-hidden="true"
            focusable="false"
          >
            <path className={styles.arrowStroke} d="M0 9L9 0L18 9" />
          </svg>
        </span>
      </DropdownMenuArrow>

      <DropdownMenuLabel className={styles.title}>Notifications</DropdownMenuLabel>

      <DropdownMenuSeparator className={styles.headerSeparator} />

      <div className={styles.notificationsList}>
        {notifications.map((notification, index) => (
          <Fragment key={notification.id}>
            <article className={styles.notification}>
              <div className={styles.notificationHeader}>
                <h3 className={clsx("boldText14", styles.notificationTitle)}>
                  {notification.title}
                </h3>

                {notification.isNew && <span className={styles.newLabel}>Новое</span>}
              </div>

              <p className={styles.notificationText}>{notification.text}</p>
              <time className={clsx("smallText", styles.notificationTime)}>
                {notification.createdAt}
              </time>
            </article>

            {index < notifications.length - 1 && (
              <DropdownMenuSeparator className={styles.itemSeparator} />
            )}
          </Fragment>
        ))}
      </div>
    </Dropdown>
  )
}
