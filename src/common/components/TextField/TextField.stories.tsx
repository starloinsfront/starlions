import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TextField } from "./TextField"

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

// Обычный инпут
export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email...",
  },
}

// Инпут с ошибкой
export const WithError: Story = {
  args: {
    label: "Password",
    errorMessage: "Error text",
    type: "password",
    value: "wrong-password",
  },
}

// Инпут поиска (с иконкой)
export const Search: Story = {
  args: {
    placeholder: "Search...",
    type: "search",
    // Здесь можно передать иконку, когда добавишь их в проект
    iconStart: null,
    iconEnd: null,
  },
}
