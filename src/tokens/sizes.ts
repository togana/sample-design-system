import { defineTokens } from "@pandacss/dev";

/**
 * サイズトークン（spacing と同じスケールを共有）
 * コンポーネントの width / height に使用
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/dimension.default.json
 */
export const sizes = defineTokens.sizes({
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
  full: { value: "100%" },
});
