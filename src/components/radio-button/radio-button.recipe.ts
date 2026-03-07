import { sva } from "@styled/css";

const labelStyles = {
  textStyle: "body.medium",
  color: "surface.on",
  _disabled: {
    color: "disabled.onSurface",
  },
} as const;

const helperTextStyles = {
  textStyle: "body.small",
  color: "surface.onVariant",
  _disabled: {
    color: "disabled.onSurface",
  },
} as const;

export const radioButtonRecipe = sva({
  slots: [
    "root",
    "label",
    "itemGroup",
    "item",
    "itemControl",
    "itemText",
    "helperText",
    "itemHelperText",
    "errorText",
  ],
  base: {
    root: {
      display: "inline-flex",
      flexDirection: "column",
      gap: "twoExtraSmall",
    },
    itemGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "extraSmall",
      _horizontal: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
    },
    label: labelStyles,
    item: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: "extraSmall",
      cursor: "pointer",
      _disabled: {
        cursor: "not-allowed",
      },
    },
    itemControl: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "7",
      height: "7",
      borderRadius: "full",
      borderWidth: "thick",
      borderStyle: "solid",
      borderColor: "outline",
      backgroundColor: "transparent",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      focusVisibleRing: "outside",
      focusRingColor: "primary",
      focusRingWidth: "thick",
      focusRingOffset: "2",
      // ::before 内円（checked 時に表示）
      _before: {
        content: '""',
        position: "absolute",
        // 外径 20px の半分。トークンスケールに 10px がないためエスケープハッチを使用
        width: "[10px]",
        height: "[10px]",
        borderRadius: "full",
        backgroundColor: "transparent",
      },
      // ::after オーバーレイ（hover 表現用）
      _after: {
        content: '""',
        position: "absolute",
        inset: "0",
        borderRadius: "full",
        pointerEvents: "none",
      },
      _checked: {
        borderColor: "primary",
        _before: {
          backgroundColor: "primary",
        },
      },
      _hover: {
        _after: {
          backgroundColor: "hovered.variant",
        },
      },
      _disabled: {
        backgroundColor: "disabled",
        borderColor: "disabled.onSurface",
        _checked: {
          borderColor: "disabled.onSurface",
          _before: {
            backgroundColor: "disabled.onSurface",
          },
        },
      },
      _invalid: {
        borderColor: "negative",
      },
    },
    itemText: labelStyles,
    helperText: helperTextStyles,
    itemHelperText: {
      ...helperTextStyles,
      marginInlineStart: "7",
      paddingInlineStart: "extraSmall",
    },
    errorText: {
      textStyle: "body.small",
      color: "negative",
    },
  },
});
