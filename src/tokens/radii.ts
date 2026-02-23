import { defineTokens } from "@pandacss/dev";

/**
 * ボーダーラディウストークン
 * Serendie Design System の dimension.radius (system) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/dimension.default.json
 */
export const radii = defineTokens.radii({
  extraSmall: { value: "2px" },
  small: { value: "4px" },
  medium: { value: "8px" },
  large: { value: "12px" },
  extraLarge: { value: "16px" },
  full: { value: "9999px" },
});
