import { defineTokens } from "@pandacss/dev";

/**
 * サイズトークン（spacing と同じスケールを共有）
 * コンポーネントの width / height に使用
 * @see https://github.com/serendie/design-token/blob/main/tokens/reference/dimension.default.json
 */
export const sizes = defineTokens.sizes({
  0: { value: "{spacing.0}" },
  1: { value: "{spacing.1}" },
  2: { value: "{spacing.2}" },
  3: { value: "{spacing.3}" },
  4: { value: "{spacing.4}" },
  5: { value: "{spacing.5}" },
  6: { value: "{spacing.6}" },
  7: { value: "{spacing.7}" },
  8: { value: "{spacing.8}" },
  9: { value: "{spacing.9}" },
  10: { value: "{spacing.10}" },
  11: { value: "{spacing.11}" },
  12: { value: "{spacing.12}" },
  13: { value: "{spacing.13}" },
  14: { value: "{spacing.14}" },
  15: { value: "{spacing.15}" },
  16: { value: "{spacing.16}" },
  17: { value: "{spacing.17}" },
  18: { value: "{spacing.18}" },
  full: { value: "100%" },
});
