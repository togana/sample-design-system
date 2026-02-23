import { defineConfig } from "@pandacss/dev";
import { conditions, theme } from "./src/preset";

export default defineConfig({
  presets: ["@pandacss/preset-base"],

  preflight: true,

  include: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],

  exclude: [],

  conditions,

  theme,

  importMap: "@styled",

  jsxFramework: "react",

  outdir: "styled-system",
});
