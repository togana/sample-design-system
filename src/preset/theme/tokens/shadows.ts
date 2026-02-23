import { defineTokens } from "@pandacss/dev";

/**
 * シャドウ（エレベーション）トークン
 * Serendie Design System の elevation.shadow (system) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/elevation.default.json
 */
export const shadows = defineTokens.shadows({
  level1: { value: "0px 1px 2px 0px #0000004D" },
  level2: { value: "0px 1px 4px 0px #00000033" },
  level3: { value: "0px 2px 8px 0px #00000033" },
  level4: { value: "0px 4px 12px 0px #00000033" },
  level5: { value: "0px 8px 24px 0px #00000033" },
});
