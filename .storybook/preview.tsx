import type { Preview } from "@storybook/nextjs-vite"
/* Fonts (Fontsource Inter) */
import "@fontsource/inter/400.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"

import "../src/app/globals.css"

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        <Story />
      </div>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0D0D0D" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
}

export default preview
