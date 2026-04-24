import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"
import { Icon } from "@/common/components/Icon/Icon"
import { TextField } from "./TextField"

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
}

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
}

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    value: "wrong-email",
    errorMessage: "Invalid email address",
  },
}

export const Disabled: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    disabled: true,
  },
}

export const WithIconStart: Story = {
  args: {
    placeholder: "Search",
    iconStart: <Icon name="searchOutline" />,
  },
}

export const WithIconEnd: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    iconEnd: <Icon name="personOutline" />,
  },
}
