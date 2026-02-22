import type { SemanticTokens } from "@pandacss/dev";

export const semanticSpacing: SemanticTokens["spacing"] = {
  component: {
    xs: { value: "{spacing.1}" },
    sm: { value: "{spacing.2}" },
    md: { value: "{spacing.3}" },
    lg: { value: "{spacing.4}" },
  },
  section: {
    sm: { value: "{spacing.6}" },
    md: { value: "{spacing.8}" },
    lg: { value: "{spacing.12}" },
  },
  page: {
    gutter: { value: "{spacing.6}" },
  },
};
