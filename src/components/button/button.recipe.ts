import { cva } from "../../../styled-system/css";
import type { RecipeVariantProps } from "../../../styled-system/css";

export const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "medium",
    lineHeight: "tight",
    borderRadius: "md",
    borderWidth: "0",
    userSelect: "none",
    whiteSpace: "nowrap",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "border.focus",
      outlineOffset: "2px",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.4,
    },
  },
  variants: {
    variant: {
      solid: {},
      outline: {
        borderWidth: "1px",
        borderStyle: "solid",
        backgroundColor: "transparent",
      },
      ghost: {
        backgroundColor: "transparent",
      },
    },
    size: {
      sm: {
        fontSize: "sm",
        height: "8",
        paddingInline: "component.md",
        gap: "component.xs",
      },
      md: {
        fontSize: "sm",
        height: "10",
        paddingInline: "component.lg",
        gap: "component.sm",
      },
      lg: {
        fontSize: "md",
        height: "12",
        paddingInline: "component.xl",
        gap: "component.sm",
      },
    },
    colorScheme: {
      brand: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      colorScheme: "brand",
      css: {
        backgroundColor: "bg.fill.brand",
        color: "text.onFill",
        "&:is(:hover, [data-hover]):not([data-disabled])": {
          backgroundColor: "bg.fill.brand.hover",
        },
        "&:is(:active, [data-active]):not([data-disabled])": {
          backgroundColor: "bg.fill.brand.hover",
        },
      },
    },
    {
      variant: "solid",
      colorScheme: "danger",
      css: {
        backgroundColor: "bg.fill.danger",
        color: "text.onFill",
        "&:is(:hover, [data-hover]):not([data-disabled])": {
          backgroundColor: "bg.fill.danger.hover",
        },
        "&:is(:active, [data-active]):not([data-disabled])": {
          backgroundColor: "bg.fill.danger.hover",
        },
      },
    },
    {
      variant: "outline",
      colorScheme: "brand",
      css: {
        borderColor: "border",
        color: "text.brand",
        "&:is(:hover, [data-hover]):not([data-disabled])": {
          backgroundColor: "bg.surface.hover",
        },
        "&:is(:active, [data-active]):not([data-disabled])": {
          backgroundColor: "bg.surface.hover",
        },
      },
    },
    {
      variant: "outline",
      colorScheme: "danger",
      css: {
        borderColor: "border.danger",
        color: "text.danger",
        "&:is(:hover, [data-hover]):not([data-disabled])": {
          backgroundColor: "bg.surface.hover",
        },
        "&:is(:active, [data-active]):not([data-disabled])": {
          backgroundColor: "bg.surface.hover",
        },
      },
    },
    {
      variant: "ghost",
      colorScheme: "brand",
      css: {
        color: "text.brand",
        "&:is(:hover, [data-hover]):not([data-disabled])": {
          backgroundColor: "bg.subtle.hover",
        },
        "&:is(:active, [data-active]):not([data-disabled])": {
          backgroundColor: "bg.subtle.hover",
        },
      },
    },
    {
      variant: "ghost",
      colorScheme: "danger",
      css: {
        color: "text.danger",
        "&:is(:hover, [data-hover]):not([data-disabled])": {
          backgroundColor: "bg.subtle.hover",
        },
        "&:is(:active, [data-active]):not([data-disabled])": {
          backgroundColor: "bg.subtle.hover",
        },
      },
    },
  ],
  defaultVariants: {
    variant: "solid",
    size: "md",
    colorScheme: "brand",
  },
});

export type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;
