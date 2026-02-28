import { defineTokens } from "@pandacss/dev";

/**
 * フォントファミリートークン
 * Serendie Design System の reference/typography.fontFamily に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/typography.default.json
 */
export const fonts = defineTokens.fonts({
  primary: {
    value: "var(--font-roboto), var(--font-noto-sans-jp), sans-serif",
  },
  monospace: { value: "var(--font-noto-sans-mono), monospace" },
});
