import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/colorPalitre.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{
        backgroundColor: '#0D0D0D',
        padding: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Story />
      </div>
    ),
  ],

  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0D0D0D" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
};

export default preview;
