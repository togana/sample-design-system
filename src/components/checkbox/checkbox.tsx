"use client";

import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import type { CheckedChangeDetails, CheckedState } from "@zag-js/checkbox";
import { Field } from "@ark-ui/react/field";
import { styled } from "@styled/jsx";
import {
  checkboxControlRecipe,
  checkboxFieldRecipe,
  checkboxHelperTextRecipe,
  checkboxLabelRecipe,
  checkboxRootRecipe,
} from "./checkbox.recipe";

const StyledField = styled(Field.Root, checkboxFieldRecipe);
const StyledRoot = styled(ArkCheckbox.Root, checkboxRootRecipe);
const StyledControl = styled(ArkCheckbox.Control, checkboxControlRecipe);
const StyledLabel = styled(ArkCheckbox.Label, checkboxLabelRecipe);
const StyledHelperText = styled(Field.HelperText, checkboxHelperTextRecipe);

export interface CheckboxProps {
  label: string;
  helperText?: string;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (details: CheckedChangeDetails) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
}

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
    value = "on",
    ...rootProps
  } = props;

  return (
    <StyledField data-disabled={disabled || undefined}>
      <StyledRoot
        readOnly={disabled || undefined}
        data-disabled={disabled || undefined}
        value={value}
        {...rootProps}
      >
        <StyledControl data-disabled={disabled || undefined}>
          <ArkCheckbox.Indicator>
            <CheckIcon />
          </ArkCheckbox.Indicator>
          <ArkCheckbox.Indicator indeterminate>
            <MinusIcon />
          </ArkCheckbox.Indicator>
        </StyledControl>
        <StyledLabel data-disabled={disabled || undefined}>
          {label}
        </StyledLabel>
        <ArkCheckbox.HiddenInput aria-disabled={disabled || undefined} />
      </StyledRoot>
      {helperText && (
        <StyledHelperText data-disabled={disabled || undefined}>
          {helperText}
        </StyledHelperText>
      )}
    </StyledField>
  );
}
