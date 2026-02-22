import { definePreview } from "@storybook/nextjs-vite";
import addonA11y from "@storybook/addon-a11y";
import addonThemes, {
  withThemeByDataAttribute,
} from "@storybook/addon-themes";

import "../src/app/globals.css";

export default definePreview({
  addons: [addonThemes(), addonA11y()],
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-color-mode",
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});
