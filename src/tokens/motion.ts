import type { Tokens } from "@pandacss/dev";

export const durations: Tokens["durations"] = {
  fast: { value: "100ms" },
  normal: { value: "200ms" },
  slow: { value: "300ms" },
};

export const easings: Tokens["easings"] = {
  default: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  in: { value: "cubic-bezier(0.4, 0, 1, 1)" },
  out: { value: "cubic-bezier(0, 0, 0.2, 1)" },
};
