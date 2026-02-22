import type { Tokens } from "@pandacss/dev";
import { spacing } from "./spacing";

export const sizes: Tokens["sizes"] = {
  ...spacing,
  full: { value: "100%" },
  min: { value: "min-content" },
  max: { value: "max-content" },
  fit: { value: "fit-content" },
};
