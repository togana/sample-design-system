import { defineTokens } from "@pandacss/dev";

/**
 * フォントサイズトークン — expanded (デスクトップ) スケール
 * Serendie Design System の reference/typography.scale.expanded に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/typography.default.json
 */
export const fontSizes = defineTokens.fontSizes({
  fourExtraSmall: { value: "10px" },
  threeExtraSmall: { value: "11px" },
  twoExtraSmall: { value: "12px" },
  extraSmall: { value: "13px" },
  small: { value: "14px" },
  medium: { value: "16px" },
  large: { value: "18px" },
  extraLarge: { value: "21px" },
  twoExtraLarge: { value: "26px" },
  threeExtraLarge: { value: "32px" },
  fourExtraLarge: { value: "43px" },
  fiveExtraLarge: { value: "64px" },
});
