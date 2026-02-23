import { defineTokens } from "@pandacss/dev";

/**
 * z-index トークン
 * Serendie Design System の elevation.zIndex (system) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/elevation.default.json
 */
export const zIndex = defineTokens.zIndex({
  deepDive: { value: -1000 },
  base: { value: 0 },
  docked: { value: 10 },
  dropdown: { value: 500 },
  modal: { value: 1000 },
  toast: { value: 2000 },
});
