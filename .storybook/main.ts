import { defineMain } from "@storybook/nextjs-vite/node";

export default defineMain({
  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: {
          dev: true,
          docs: true,
        },
        experimentalFormat: "markdown",
      },
    },
  ],
  features: {
    experimentalComponentsManifest: true,
  },
});
