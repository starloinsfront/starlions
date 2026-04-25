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
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "outline", "link", "languageSwitcher"],
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

export const FullWidth: Story = {
  args: {
    variant: "primary",
    fullWidth: true,
    children: "Full Width Button",
  },
}

export const Link: Story = {
  render: () => (
    <Button asChild variant="link">
      <a href="/sign-up">Sign Up</a>
    </Button>
  ),
}

export const LanguageSwitcher: Story = {
  render: () => (
    <Button variant="languageSwitcher">
      <Icon name="flagRussiaFilled" />
      Russian
    </Button>
  ),
}
