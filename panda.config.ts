import { defineConfig } from "@pandacss/dev";
import {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  lineHeights,
  shadows,
  durations,
  easings,
  semanticColors,
  semanticSpacing,
} from "./src/tokens";

export default defineConfig({
  presets: ["@pandacss/preset-base"],

  preflight: true,

  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  exclude: [],

  conditions: {
    light: "[data-color-mode=light] &",
    dark: "[data-color-mode=dark] &",
  },

  theme: {
    keyframes: {
      spin: {
        to: { transform: "rotate(360deg)" },
      },
    },
    tokens: {
      colors,
      spacing,
      fontSizes,
      fontWeights,
      lineHeights,
      shadows,
      durations,
      easings,
    },
    semanticTokens: {
      colors: semanticColors,
      spacing: semanticSpacing,
      fontSizes: {
        body: { value: "{fontSizes.sm}" },
        heading: { value: "{fontSizes.xl}" },
        caption: { value: "{fontSizes.xs}" },
      },
      shadows: {
        card: { value: "{shadows.sm}" },
        dropdown: { value: "{shadows.md}" },
        modal: { value: "{shadows.lg}" },
      },
    },
  },

  outdir: "styled-system",
});
