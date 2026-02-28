"use client";

import type { ComponentProps, MouseEvent, ReactElement } from "react";
import { styled } from "@styled/jsx";
import { buttonRecipe } from "./button.recipe";

const StyledButton = styled("button", buttonRecipe);

type StyledButtonProps = ComponentProps<typeof StyledButton>;

// leftIcon と rightIcon の排他型
type IconProps =
  | { leftIcon?: ReactElement; rightIcon?: never }
  | { leftIcon?: never; rightIcon?: ReactElement };

export type ButtonProps = Omit<StyledButtonProps, "disabled"> &
  IconProps & {
    isLoading?: boolean;
    disabled?: boolean;
  };

function Spinner() {
  return (
    <styled.svg
      animation="spin 0.6s linear infinite"
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="10"
      />
    </styled.svg>
  );
}

export function Button(props: ButtonProps) {
  const {
    children,
    leftIcon,
    rightIcon,
    isLoading = false,
    disabled = false,
    onClick,
    styleType,
    size,
    ...rest
  } = props;

  const isDisabled = disabled || isLoading;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <StyledButton
      styleType={styleType}
      size={size}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      data-disabled={isDisabled || undefined}
      onClick={handleClick}
      {...rest}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </StyledButton>
  );
}
