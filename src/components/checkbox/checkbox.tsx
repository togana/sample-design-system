"use client";

import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import type { CheckedChangeDetails, CheckedState } from "@zag-js/checkbox";
import { Field } from "@ark-ui/react/field";
import { createStyleContext } from "@styled/jsx/create-style-context";
import { checkboxRecipe } from "./checkbox.recipe";

const { withProvider, withContext } = createStyleContext(checkboxRecipe);

const StyledField = withProvider(Field.Root, "field");
const StyledRoot = withContext(ArkCheckbox.Root, "root");
const StyledControl = withContext(ArkCheckbox.Control, "control");
const StyledLabel = withContext(ArkCheckbox.Label, "label");
const StyledHelperText = withContext(Field.HelperText, "helperText");
const StyledErrorText = withContext(Field.ErrorText, "errorText");

export type CheckboxProps = {
  label: string;
  helperText?: string;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (details: CheckedChangeDetails) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorText?: string;
  name?: string;
  value?: string;
};

function CheckIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.5 3.5L5.5 9.5L2.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7H11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Checkbox(props: CheckboxProps) {
  const {
    label,
    helperText,
    disabled = false,
    invalid = false,
    errorText,
    value = "on",
    ...rootProps
  } = props;

  // disabled 時はエラー表示しない（操作できない状態でエラーを示すのは不適切）
  const isInvalid = invalid && !disabled;
  const showError = isInvalid && !!errorText;

  return (
    // Field.Root の disabled / invalid はコンテキスト経由で子パーツに自動伝播する（ADR-014）
    // Field.ErrorText の id / aria-describedby 連携も自動管理する
    <StyledField
      disabled={disabled || undefined}
      invalid={isInvalid}
    >
      <StyledRoot value={value} {...rootProps}>
        <StyledControl>
          <ArkCheckbox.Indicator>
            <CheckIcon />
          </ArkCheckbox.Indicator>
          <ArkCheckbox.Indicator indeterminate>
            <MinusIcon />
          </ArkCheckbox.Indicator>
        </StyledControl>
        <StyledLabel>{label}</StyledLabel>
        <ArkCheckbox.HiddenInput />
      </StyledRoot>
      {helperText && <StyledHelperText>{helperText}</StyledHelperText>}
      {showError && <StyledErrorText>{errorText}</StyledErrorText>}
    </StyledField>
  );
}
