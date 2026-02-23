import { cva } from "@styled/css";
import type { RecipeVariantProps } from "@styled/css";

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
        _hover: {
          backgroundColor: "bg.fill.brand.hover",
        },
        _active: {
          backgroundColor: "bg.fill.brand.active",
        },
      },
    },
    {
      variant: "solid",
      colorScheme: "danger",
      css: {
        backgroundColor: "bg.fill.danger",
        color: "text.onFill",
        _hover: {
          backgroundColor: "bg.fill.danger.hover",
        },
        _active: {
          backgroundColor: "bg.fill.danger.active",
        },
      },
    },
    {
      variant: "outline",
      colorScheme: "brand",
      css: {
        borderColor: "border",
        color: "text.brand",
        _hover: {
          backgroundColor: "bg.surface.hover",
        },
        _active: {
          backgroundColor: "bg.surface.active",
        },
      },
    },
    {
      variant: "outline",
      colorScheme: "danger",
      css: {
        borderColor: "border.danger",
        color: "text.danger",
        _hover: {
          backgroundColor: "bg.surface.hover",
        },
        _active: {
          backgroundColor: "bg.surface.active",
        },
      },
    },
    {
      variant: "ghost",
      colorScheme: "brand",
      css: {
        color: "text.brand",
        _hover: {
          backgroundColor: "bg.subtle.hover",
        },
        _active: {
          backgroundColor: "bg.subtle.active",
        },
      },
    },
    {
      variant: "ghost",
      colorScheme: "danger",
      css: {
        color: "text.danger",
        _hover: {
          backgroundColor: "bg.subtle.hover",
        },
        _active: {
          backgroundColor: "bg.subtle.active",
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
