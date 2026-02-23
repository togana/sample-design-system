import { defineTokens } from "@pandacss/dev";

/**
 * スペーシングトークン
 * Serendie Design System の dimension.scale (reference) と dimension.spacing (system) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/dimension.default.json
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/dimension.default.json
 */
export const spacing = defineTokens.spacing({
  // --- Primitive scale (reference) ---
  // Serendie dimension.scale.0〜18
  0: { value: "0px" },
  1: { value: "1px" },
  2: { value: "2px" },
  3: { value: "4px" },
  4: { value: "8px" },
  5: { value: "12px" },
  6: { value: "16px" },
  7: { value: "20px" },
  8: { value: "24px" },
  9: { value: "28px" },
  10: { value: "32px" },
  11: { value: "36px" },
  12: { value: "40px" },
  13: { value: "48px" },
  14: { value: "56px" },
  15: { value: "64px" },
  16: { value: "72px" },
  17: { value: "80px" },
  18: { value: "96px" },

  // --- Semantic spacing (system) ---
  // Serendie dimension.spacing.*
  none: { value: "{spacing.0}" },
  twoExtraSmall: { value: "{spacing.3}" },
  extraSmall: { value: "{spacing.4}" },
  small: { value: "{spacing.5}" },
  medium: { value: "{spacing.6}" },
  large: { value: "{spacing.7}" },
  extraLarge: { value: "{spacing.8}" },
  twoExtraLarge: { value: "{spacing.10}" },
  threeExtraLarge: { value: "{spacing.12}" },
  fourExtraLarge: { value: "{spacing.13}" },
  fiveExtraLarge: { value: "{spacing.15}" },
  sixExtraLarge: { value: "{spacing.17}" },
});
