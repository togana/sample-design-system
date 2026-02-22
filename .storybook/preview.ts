import type { Preview, ReactRenderer } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-color-mode",
    }),
  ],
};

export default preview;
