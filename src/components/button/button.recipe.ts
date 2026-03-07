import { cva } from "@styled/css";

const hoverVariantOverlay = {
  _hover: { _after: { backgroundColor: "hovered.variant" } },
  _active: { _after: { backgroundColor: "hovered.variant" } },
} as const;

const focusVisibleOverlay = {
  _focusVisible: {
    borderColor: "outline.dim",
    _after: { backgroundColor: "hovered.variant" },
  },
} as const;

const outlinedDisabled = {
  backgroundColor: "disabled",
  color: "disabled.onSurface",
  borderColor: "transparent",
} as const;

export const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "twoExtraSmall",
    borderRadius: "full",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    border: "none",
    fontWeight: "bold",
    focusVisibleRing: "outside",
    focusRingColor: "primary",
    focusRingWidth: "thick",
    focusRingOffset: "2",
    _disabled: {
      cursor: "not-allowed",
    },
    // ::after オーバーレイ（hover / focus 表現用）
    _after: {
      content: '""',
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
    },
  },
  variants: {
    styleType: {
      filled: {
        backgroundColor: "primary",
        color: "primary.on",
        _hover: {
          _after: {
            backgroundColor: "hovered",
          },
        },
        _active: {
          _after: {
            backgroundColor: "hovered",
          },
        },
        _disabled: {
          backgroundColor: "disabled",
          color: "disabled.onSurface",
        },
      },
      outlined: {
        backgroundColor: "transparent",
        color: "surface.on",
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "outline",
        ...hoverVariantOverlay,
        ...focusVisibleOverlay,
        _disabled: outlinedDisabled,
      },
      ghost: {
        backgroundColor: "transparent",
        color: "primary",
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "transparent",
        ...hoverVariantOverlay,
        ...focusVisibleOverlay,
        _disabled: {
          color: "disabled.onSurface",
        },
      },
      rectangle: {
        backgroundColor: "transparent",
        color: "surface.on",
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "outline",
        borderRadius: "medium",
        ...hoverVariantOverlay,
        ...focusVisibleOverlay,
        _disabled: outlinedDisabled,
      },
    },
    size: {
      medium: {
        height: "13",
        paddingInline: "extraLarge",
        paddingBlock: "small",
        textStyle: "label.large",
      },
      small: {
        height: "10",
        paddingInline: "small",
        paddingBlock: "twoExtraSmall",
        textStyle: "label.medium",
      },
    },
  },
  defaultVariants: {
    styleType: "filled",
    size: "medium",
  },
});
