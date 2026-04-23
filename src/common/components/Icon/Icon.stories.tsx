import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Icon } from "./Icon"
import { IconName } from "@/common/components/Icon/IconNameType"

const iconNames: IconName[] = [
  "arrowBackOutline",
  "arrowForwardOutline",
  "addOutline",
  "addFilled",
  "arrowIosDownOutline",
  "bookmarkOutline",
  "bookmarkFilled",
  "calendarOutline",
  "calendarFilled",
  "copyOutline",
  "copyFilled",
  "creditCardOutline",
  "creditCardFilled",
  "checkmarkOutline",
  "closeOutline",
  "colorPaletteOutline",
  "doneAllOutline",
  "edit2Outline",
  "edit2Filled",
  "emailOutline",
  "emailFilled",
  "expandOutline",
  "eyeOutline",
  "eyeFilled",
  "eyeOffOutline",
  "eyeOffFilled",
  "facebookFilled",
  "flagRussiaFilled",
  "flagUnitedKingdomFilled",
  "braveFilled",
  "explorerFilled",
  "firefoxFilled",
  "githubFilled",
  "googleFilled",
  "homeOutline",
  "homeFilled",
  "heartOutline",
  "heartFilled",
  "imageOutline",
  "imageFilled",
  "layersOutline",
  "layersFilled",
  "logOutOutline",
  "maximizeOutline",
  "maximizeFilled",
  "menuOutline",
  "messageCircleOutline",
  "messageCircleFilled",
  "microsoftEdgeFilled",
  "micOutline",
  "micFilled",
  "moreHorizontalOutline",
  "operaFilled",
  "paidFilled",
  "pauseCircleOutline",
  "pauseCircleFilled",
  "paypalFilled",
  "paperPlaneOutline",
  "personOutline",
  "personFilled",
  "personAddOutline",
  "personAddFilled",
  "personRemoveOutline",
  "personRemoveFilled",
  "pinOutline",
  "pinFilled",
  "playCircleOutline",
  "playCircleFilled",
  "plusCircleOutline",
  "plusCircleFilled",
  "radioButtonUncheckedOutline",
  "radioButtonCheckedFilled",
  "recaptchaLogoFilled",
  "safariFilled",
  "searchOutline",
  "settingsOutline",
  "settingsFilled",
  "stripeFilled",
  "trashOutline",
  "trashFilled",
  "trendingUpFilled",
  "ucBrowserFilled",
  "yandexFilled",
]

const meta = {
  title: "Common/Icon",
  component: Icon,
  args: {
    name: "addOutline",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            background: "var(--dark-300)",
            border: "1px solid var(--dark-100)",
            borderRadius: "12px",
            color: "var(--light-100)",
            display: "grid",
            gap: "12px",
            justifyItems: "start",
            padding: "16px",
          }}
        >
          <Icon name={name} />
          <span
            style={{
              color: "var(--light-900)",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "12px",
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}
