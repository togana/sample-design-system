import { defineTokens } from "@pandacss/dev";

/**
 * ラインハイトトークン
 * Serendie Design System の reference/typography.lineHeight に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/typography.default.json
 */
export const lineHeights = defineTokens.lineHeights({
  none: { value: "1" },
  tight: { value: "1.4" },
  normal: { value: "1.6" },
  relaxed: { value: "1.8" },
});
