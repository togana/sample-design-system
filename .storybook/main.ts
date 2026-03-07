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
  // Storybook ビルド時の無害な Vite/Rollup 警告を抑制する
  viteFinal(config) {
    config.build ??= {};
    // Storybook の iframe バンドルは単一チャンクが大きくなるため閾値を引き上げ
    config.build.chunkSizeWarningLimit = 3000;
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.onwarn = (warning, defaultHandler) => {
      // "use client" ディレクティブは Storybook（クライアント専用）では不要
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
      if (warning.code === "SOURCEMAP_ERROR") return;
      defaultHandler(warning);
    };
    return config;
  },
});
