import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./Button"
import { Icon } from "@/common/components/Icon/Icon"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "outline", "link"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
}

export const LanguageSwitcher: Story = {
  args: {
    variant: "secondary",
    iconStart: <Icon name="flagRussiaFilled" />,
    children: "Russian",
  },
}

export const FullWidth: Story = {
  args: {
    variant: "primary",
    fullWidth: true,
    children: "Full Width Button",
  },
}

export const Link: Story = {
  args: {
    variant: "link",
    asChild: true,
    children: <a href="/sign-up">Sign Up</a>,
  },
}
