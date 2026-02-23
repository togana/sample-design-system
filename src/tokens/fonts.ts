import { defineTokens } from "@pandacss/dev";

/**
 * フォントファミリートークン
 * Serendie Design System の reference/typography.fontFamily に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/typography.default.json
 */
export const fonts = defineTokens.fonts({
  primary: { value: "Roboto, 'Noto Sans JP', sans-serif" },
  monospace: { value: "'Noto Sans Mono', monospace" },
});
