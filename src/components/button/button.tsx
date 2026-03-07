"use client";

import type { MouseEvent, ReactElement, ReactNode } from "react";
import { styled } from "@styled/jsx";
import { buttonRecipe } from "./button.recipe";

const StyledButton = styled("button", buttonRecipe);

// leftIcon と rightIcon の排他型
type IconProps =
  | { leftIcon?: ReactElement; rightIcon?: never }
  | { leftIcon?: never; rightIcon?: ReactElement };

// children がない場合（icon-only）は aria-label を必須にする
type LabelProps =
  | { children: ReactNode; "aria-label"?: string }
  | { children?: never; "aria-label": string };

export type ButtonProps = IconProps &
  LabelProps & {
  /**
   * ボタンのスタイルバリアント。
   * @default "filled"
   */
  styleType?: "filled" | "outlined" | "ghost" | "rectangle";
  /**
   * ボタンのサイズ。
   * @default "medium"
   */
  size?: "medium" | "small";
  /** 非活性状態。フォーカスは維持されるが操作はできない */
  disabled?: boolean;
  /**
   * ローディング状態。Spinner を表示しクリックをブロックする。
   * @default false
   */
  isLoading?: boolean;
  /** ラベル左側に表示するアイコン。`rightIcon` と排他 */
  leftIcon?: ReactElement;
  /** ラベル右側に表示するアイコン。`leftIcon` と排他 */
  rightIcon?: ReactElement;
  /** クリック時のコールバック */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

function Spinner() {
  return (
    <styled.svg
      animation="spin 0.6s linear infinite"
      aria-hidden="true"
      width="[1em]"
      height="[1em]"
      viewBox="0 0 24 24"
      fill="[none]"
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
