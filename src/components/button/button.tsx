"use client";

import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import { css, cx } from "../../../styled-system/css";
import { buttonRecipe } from "./button.recipe";
import type { ButtonVariantProps } from "./button.recipe";

/**
 * icon-only ボタン（children なし）の場合は `aria-label` を必ず指定すること。
 *
 * @example
 * ```tsx
 * // テキストボタン
 * <Button>保存</Button>
 *
 * // icon-only ボタン（aria-label 必須）
 * <Button leftIcon={<CloseIcon />} aria-label="閉じる" />
 * ```
 */
export type ButtonProps = ComponentPropsWithRef<"button"> &
  ButtonVariantProps & {
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

function Spinner() {
  return (
    <svg
      className={css({ animation: "spin 0.6s linear infinite" })}
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
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const {
    ref,
    variant,
    size,
    colorScheme,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className,
    children,
    onClick,
    type = "button",
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cx(buttonRecipe({ variant, size, colorScheme }), className)}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      data-disabled={isDisabled || undefined}
      data-loading={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}
