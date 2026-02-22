// @ts-expect-error -- exports subpath; IDE の型解決で誤検知されるが tsc・ランタイムともに正常
import { defineMain } from "@storybook/nextjs-vite/node";

export default defineMain({
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: {
          dev: true,
          docs: true,
        },
      },
    },
  ],
  features: {
    experimentalComponentsManifest: true,
  },
});
