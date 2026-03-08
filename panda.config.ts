import { defineConfig } from "@pandacss/dev";
import { conditions, theme } from "./src/preset";

const isProduction = process.env.NODE_ENV === "production";

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

  minify: isProduction,

  hash: isProduction ? { cssVar: false, className: true } : false,

  shorthands: false,

  strictTokens: true,

  strictPropertyValues: true,

  validation: "error",
});
