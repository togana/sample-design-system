import type { Tokens } from "@pandacss/dev";

export const fontSizes: Tokens["fontSizes"] = {
  xs: { value: "12px" },
  sm: { value: "14px" },
  md: { value: "16px" },
  lg: { value: "18px" },
  xl: { value: "20px" },
  "2xl": { value: "24px" },
  "3xl": { value: "30px" },
  "4xl": { value: "36px" },
};

export const fontWeights: Tokens["fontWeights"] = {
  regular: { value: "400" },
  medium: { value: "500" },
  semibold: { value: "600" },
  bold: { value: "700" },
};

export const lineHeights: Tokens["lineHeights"] = {
  tight: { value: "1.25" },
  normal: { value: "1.5" },
  loose: { value: "1.75" },
};
