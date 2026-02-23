import { defineConfig } from "@pandacss/dev";
import {
  borderWidths,
  colors,
  fontSizes,
  fontWeights,
  fonts,
  lineHeights,
  radii,
  semanticColors,
  shadows,
  sizes,
  spacing,
  zIndex,
} from "./src/tokens";
import { textStyles } from "./src/styles";

export default defineConfig({
  presets: ["@pandacss/preset-base"],

  preflight: true,

  include: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],

  exclude: [],

  conditions: {
    light: "[data-color-mode=light] &",
    dark: "[data-color-mode=dark] &",
    // preset-base の _hover / _active を上書きし、data-disabled 時はスタイルを適用しない
    hover: "&:is(:hover, [data-hover]):not([data-disabled])",
    active: "&:is(:active, [data-active]):not([data-disabled])",
  },

  theme: {
    tokens: {
      colors,
      spacing,
      sizes,
      fonts,
      fontSizes,
      fontWeights,
      lineHeights,
      radii,
      borderWidths,
      shadows,
      zIndex,
    },
    semanticTokens: {
      colors: semanticColors,
    },
    textStyles,
  },

  importMap: "@styled",

  jsxFramework: "react",

  outdir: "styled-system",
});
