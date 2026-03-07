import { sva } from "@styled/css";

const checkedStyles = {
  backgroundColor: "primary",
  borderWidth: "none",
  color: "primary.on",
  _hover: {
    _after: {
      backgroundColor: "hovered",
    },
  },
} as const;

const disabledCheckedStyles = {
  borderWidth: "none",
  color: "disabled.onSurface",
} as const;

export const checkboxRecipe = sva({
  slots: ["field", "root", "control", "label", "helperText"],
  base: {
    field: {
      display: "inline-flex",
      flexDirection: "column",
      gap: "twoExtraSmall",
    },
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: "extraSmall",
      cursor: "pointer",
      _disabled: {
        cursor: "not-allowed",
      },
    },
    control: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "7",
      height: "7",
      borderRadius: "small",
      borderWidth: "thick",
      borderStyle: "solid",
      borderColor: "outline",
      backgroundColor: "transparent",
      color: "transparent",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      focusVisibleRing: "outside",
      focusRingColor: "primary",
      focusRingWidth: "thick",
      focusRingOffset: "2",
      // ::after オーバーレイ（hover 表現用）
      _after: {
        content: '""',
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
      },
      _checked: checkedStyles,
      _indeterminate: checkedStyles,
      _hover: {
        _after: {
          backgroundColor: "hovered.variant",
        },
      },
      _disabled: {
        backgroundColor: "disabled",
        borderColor: "disabled.onSurface",
        color: "transparent",
        _checked: disabledCheckedStyles,
        _indeterminate: disabledCheckedStyles,
      },
      _invalid: {
        borderColor: "negative",
      },
    },
    label: {
      textStyle: "body.medium",
      color: "surface.on",
      _disabled: {
        color: "disabled.onSurface",
      },
    },
    helperText: {
      textStyle: "body.small",
      color: "surface.onVariant",
      marginInlineStart: "7",
      paddingInlineStart: "extraSmall",
      _disabled: {
        color: "disabled.onSurface",
      },
    },
  },
});
