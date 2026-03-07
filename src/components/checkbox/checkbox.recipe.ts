import { cva } from "@styled/css";

export const checkboxFieldRecipe = cva({
  base: {
    display: "inline-flex",
    flexDirection: "column",
    gap: "twoExtraSmall",
  },
});

export const checkboxRootRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "flex-start",
    gap: "extraSmall",
    cursor: "pointer",
    _disabled: {
      cursor: "not-allowed",
    },
  },
});

export const checkboxControlRecipe = cva({
  base: {
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
    // hover overlay
    _after: {
      content: '""',
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
    },
    _checked: {
      backgroundColor: "primary",
      borderWidth: "none",
      color: "primary.on",
      _hover: {
        _after: {
          backgroundColor: "hovered",
        },
      },
    },
    _indeterminate: {
      backgroundColor: "primary",
      borderWidth: "none",
      color: "primary.on",
      _hover: {
        _after: {
          backgroundColor: "hovered",
        },
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
      color: "transparent",
      _checked: {
        borderWidth: "none",
        color: "disabled.onSurface",
      },
      _indeterminate: {
        borderWidth: "none",
        color: "disabled.onSurface",
      },
    },
    _invalid: {
      borderColor: "negative",
    },
  },
});

export const checkboxLabelRecipe = cva({
  base: {
    textStyle: "body.medium",
    color: "surface.on",
    _disabled: {
      color: "disabled.onSurface",
    },
  },
});

export const checkboxHelperTextRecipe = cva({
  base: {
    textStyle: "body.small",
    color: "surface.onVariant",
    marginInlineStart: "7",
    paddingInlineStart: "extraSmall",
    _disabled: {
      color: "disabled.onSurface",
    },
  },
});
