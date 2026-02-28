import { cva } from "@styled/css";

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
    textStyle: "label.large",
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
        _hover: {
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _active: {
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _focusVisible: {
          borderColor: "outline.dim",
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _disabled: {
          backgroundColor: "disabled",
          color: "disabled.onSurface",
          borderColor: "transparent",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "primary",
        _hover: {
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _active: {
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _focusVisible: {
          borderWidth: "medium",
          borderStyle: "solid",
          borderColor: "outline.dim",
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
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
        _hover: {
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _active: {
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _focusVisible: {
          borderColor: "outline.dim",
          _after: {
            backgroundColor: "hovered.variant",
          },
        },
        _disabled: {
          backgroundColor: "disabled",
          color: "disabled.onSurface",
          borderColor: "transparent",
        },
      },
    },
    size: {
      medium: {
        height: "13",
        paddingX: "extraLarge",
        paddingY: "small",
        textStyle: "label.large",
      },
      small: {
        height: "10",
        paddingX: "small",
        paddingY: "twoExtraSmall",
        textStyle: "label.medium",
      },
    },
  },
  defaultVariants: {
    styleType: "filled",
    size: "medium",
  },
});
