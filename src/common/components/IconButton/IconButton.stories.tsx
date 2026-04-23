import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { IconButton } from "./IconButton"
import { IconName } from "@/common/components/Icon/IconNameType"

const iconConfigs: Array<{
  activeIconName?: IconName
  iconName: IconName
  label: string
}> = [
  { iconName: "arrowBackOutline", label: "Arrow Back" },
  { iconName: "arrowForwardOutline", label: "Arrow Forward" },
  { activeIconName: "addFilled", iconName: "addOutline", label: "Add" },
  { iconName: "arrowIosDownOutline", label: "Arrow IOS Down" },
  { activeIconName: "bookmarkFilled", iconName: "bookmarkOutline", label: "Bookmark" },
  { activeIconName: "calendarFilled", iconName: "calendarOutline", label: "Calendar" },
  {
    activeIconName: "doneAllOutline",
    iconName: "checkmarkOutline",
    label: "Checkmark",
  },
  { iconName: "closeOutline", label: "Close" },
  { iconName: "colorPaletteOutline", label: "Color Palette" },
  { activeIconName: "copyFilled", iconName: "copyOutline", label: "Copy" },
  { activeIconName: "creditCardFilled", iconName: "creditCardOutline", label: "Credit Card" },
  { activeIconName: "edit2Filled", iconName: "edit2Outline", label: "Edit 2" },
  { activeIconName: "emailFilled", iconName: "emailOutline", label: "Email" },
  { iconName: "expandOutline", label: "Expand" },
  { activeIconName: "eyeFilled", iconName: "eyeOutline", label: "Eye" },
  { activeIconName: "eyeOffFilled", iconName: "eyeOffOutline", label: "Eye Off" },
  { iconName: "facebookFilled", label: "Facebook" },
  { iconName: "flagRussiaFilled", label: "Flag Russia" },
  { iconName: "flagUnitedKingdomFilled", label: "Flag United Kingdom" },
  { iconName: "braveFilled", label: "Brave" },
  { iconName: "explorerFilled", label: "Explorer" },
  { iconName: "firefoxFilled", label: "Firefox" },
  { iconName: "githubFilled", label: "GitHub" },
  { iconName: "googleFilled", label: "Google" },
  { activeIconName: "homeFilled", iconName: "homeOutline", label: "Home" },
  { activeIconName: "heartFilled", iconName: "heartOutline", label: "Heart" },
  { activeIconName: "imageFilled", iconName: "imageOutline", label: "Image" },
  { activeIconName: "layersFilled", iconName: "layersOutline", label: "Layers" },
  { iconName: "logOutOutline", label: "Log Out" },
  { activeIconName: "maximizeFilled", iconName: "maximizeOutline", label: "Maximize" },
  { iconName: "menuOutline", label: "Menu" },
  {
    activeIconName: "messageCircleFilled",
    iconName: "messageCircleOutline",
    label: "Message Circle",
  },
  { iconName: "microsoftEdgeFilled", label: "Microsoft Edge" },
  { activeIconName: "micFilled", iconName: "micOutline", label: "Mic" },
  { iconName: "moreHorizontalOutline", label: "More Horizontal" },
  { iconName: "operaFilled", label: "Opera" },
  { iconName: "paidFilled", label: "Paid" },
  { activeIconName: "pauseCircleFilled", iconName: "pauseCircleOutline", label: "Pause Circle" },
  { iconName: "paypalFilled", label: "PayPal" },
  { iconName: "paperPlaneOutline", label: "Paper Plane" },
  { activeIconName: "personFilled", iconName: "personOutline", label: "Person" },
  { activeIconName: "personAddFilled", iconName: "personAddOutline", label: "Person Add" },
  { activeIconName: "personRemoveFilled", iconName: "personRemoveOutline", label: "Person Remove" },
  { activeIconName: "pinFilled", iconName: "pinOutline", label: "Pin" },
  { activeIconName: "playCircleFilled", iconName: "playCircleOutline", label: "Play Circle" },
  { activeIconName: "plusCircleFilled", iconName: "plusCircleOutline", label: "Plus Circle" },
  {
    activeIconName: "radioButtonCheckedFilled",
    iconName: "radioButtonUncheckedOutline",
    label: "Radio Button",
  },
  { iconName: "recaptchaLogoFilled", label: "Recaptcha Logo" },
  { iconName: "safariFilled", label: "Safari" },
  { iconName: "searchOutline", label: "Search" },
  { activeIconName: "settingsFilled", iconName: "settingsOutline", label: "Settings" },
  { iconName: "stripeFilled", label: "Stripe" },
  { activeIconName: "trashFilled", iconName: "trashOutline", label: "Trash" },
  { iconName: "trendingUpFilled", label: "Trending Up" },
  { iconName: "ucBrowserFilled", label: "UC Browser" },
  { iconName: "yandexFilled", label: "Yandex" },
]

const meta = {
  title: "Common/IconButton",
  component: IconButton,
  args: {
    children: "Add",
    iconName: "addOutline",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ActiveState: Story = {
  args: {
    activeIconName: "addFilled",
    color: "var(--accent-500)",
    iconName: "addOutline",
    isActive: true,
  },
}

export const DisableState: Story = {
  args: {
    disabled: true,
    iconName: "addOutline",
  },
}

export const HoverState: Story = {
  args: {
    iconName: "addOutline",
    style: {
      color: "var(--accent-100)",
    },
  },
}

export const AllIcons: Story = {
  render: () => {
    const IconButtonGallery = () => {
      const [activeIcons, setActiveIcons] = useState<Record<string, boolean>>({})

      const toggleIcon = (iconName: IconName) => {
        setActiveIcons((prev) => ({
          ...prev,
          [iconName]: !prev[iconName],
        }))
      }

      return (
        <section
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          <div style={{ display: "grid", gap: "8px" }}>
            <h1 style={{ color: "var(--light-100)", fontSize: "28px", lineHeight: 1.1 }}>
              IconButton Manual Test
            </h1>
            <p style={{ color: "var(--light-900)", margin: 0, maxWidth: "720px" }}>
              Click each button to test active color and, where available, outline/filled icon
              switching.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {iconConfigs.map(({ activeIconName, iconName, label }) => (
              <div
                key={iconName}
                style={{
                  background: "var(--dark-300)",
                  border: "1px solid var(--dark-100)",
                  borderRadius: "12px",
                  display: "grid",
                  gap: "12px",
                  padding: "16px",
                }}
              >
                <span
                  style={{
                    color: "var(--light-900)",
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "12px",
                  }}
                >
                  {iconName}
                </span>
                <IconButton
                  activeIconName={activeIconName}
                  iconName={iconName}
                  isActive={Boolean(activeIcons[iconName])}
                  onClick={() => toggleIcon(iconName)}
                >
                  {label}
                </IconButton>
              </div>
            ))}
          </div>
        </section>
      )
    }

    return <IconButtonGallery />
  },
}
