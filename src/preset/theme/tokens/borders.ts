import { defineTokens } from "@pandacss/dev";

/**
 * ボーダー幅トークン
 * Serendie Design System の dimension.border (system) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/dimension.default.json
 */
export const borderWidths = defineTokens.borderWidths({
  none: { value: "0px" },
  medium: { value: "1px" },
  thick: { value: "2px" },
  extraThick: { value: "4px" },
});
