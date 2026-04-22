import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./Button"

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered", // Отрисует кнопку ровно по центру экрана
  },
  tags: ["autodocs"],
  argTypes: {
    // Настройка удобных переключателей для Storybook
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
    children: "Primary Next Button",
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

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
}
