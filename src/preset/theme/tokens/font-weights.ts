import { defineTokens } from "@pandacss/dev";

/**
 * フォントウェイトトークン
 * Serendie Design System の reference/typography.fontWeight に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/typography.default.json
 */
export const fontWeights = defineTokens.fontWeights({
  regular: { value: "400" },
  bold: { value: "700" },
});
