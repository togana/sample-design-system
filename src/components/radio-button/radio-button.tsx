"use client";

import { createContext, useContext, useId } from "react";
import {
  RadioGroup as ArkRadioGroup,
  type RadioGroupValueChangeDetails,
} from "@ark-ui/react/radio-group";
import { createStyleContext } from "@styled/jsx/create-style-context";
import { styled } from "@styled/jsx";
import { radioButtonRecipe } from "./radio-button.recipe";

const GroupDisabledContext = createContext(false);

const { withProvider, withContext } = createStyleContext(radioButtonRecipe);

const StyledRoot = withProvider(ArkRadioGroup.Root, "root");
const StyledLabel = withContext(ArkRadioGroup.Label, "label");
const StyledItem = withContext(ArkRadioGroup.Item, "item");
const StyledItemControl = withContext(ArkRadioGroup.ItemControl, "itemControl");
const StyledItemText = withContext(ArkRadioGroup.ItemText, "itemText");
const StyledItemGroup = withContext(styled("div"), "itemGroup");
const StyledHelperText = withContext(styled("p"), "helperText");
const StyledItemHelperText = withContext(styled("p"), "itemHelperText");
const StyledErrorText = withContext(styled("p"), "errorText");

export type RadioGroupProps = {
  label: string;
  helperText?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (details: RadioGroupValueChangeDetails) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorText?: string;
  name?: string;
  orientation?: "vertical" | "horizontal";
  children: React.ReactNode;
};

export type RadioButtonItemProps = {
  label: string;
  value: string;
  helperText?: string;
  disabled?: boolean;
};

export function RadioGroup(props: RadioGroupProps) {
  const {
    label,
    helperText,
    disabled = false,
    invalid = false,
    errorText,
    orientation = "vertical",
    children,
    ...rootProps
  } = props;

  const helperTextId = useId();
  const errorTextId = useId();

  // disabled 時はエラー表示しない（操作できない状態でエラーを示すのは不適切）
  const isInvalid = invalid && !disabled;
  const showError = isInvalid && !!errorText;

  const describedBy =
    [helperText ? helperTextId : null, showError ? errorTextId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    // Field.Root と同様に readOnly で操作を無効化し、aria-disabled + data-disabled を手動伝播する
    // Ark UI の disabled はネイティブ disabled を hidden input に付与しフォーカスを喪失させるため使わない
    <StyledRoot
      readOnly={disabled || undefined}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      invalid={isInvalid}
      orientation={orientation}
      aria-describedby={describedBy}
      {...rootProps}
    >
      <StyledLabel data-disabled={disabled || undefined}>{label}</StyledLabel>
      {helperText && (
        <StyledHelperText
          id={helperTextId}
          data-disabled={disabled || undefined}
        >
          {helperText}
        </StyledHelperText>
      )}
      <GroupDisabledContext.Provider value={disabled}>
        <StyledItemGroup data-orientation={orientation}>
          {children}
        </StyledItemGroup>
      </GroupDisabledContext.Provider>
      {showError && (
        <StyledErrorText id={errorTextId} role="alert">
          {errorText}
        </StyledErrorText>
      )}
    </StyledRoot>
  );
}

export function RadioButtonItem(props: RadioButtonItemProps) {
  const { label, value, helperText, disabled = false } = props;
  const groupDisabled = useContext(GroupDisabledContext);
  const isDisabled = disabled || groupDisabled;
  const itemHelperTextId = useId();

  return (
    <>
      <StyledItem
        value={value}
        disabled={disabled || undefined}
        data-disabled={isDisabled || undefined}
        aria-describedby={helperText ? itemHelperTextId : undefined}
      >
        <StyledItemControl data-disabled={isDisabled || undefined} />
        <StyledItemText data-disabled={isDisabled || undefined}>
          {label}
        </StyledItemText>
        <ArkRadioGroup.ItemHiddenInput
          aria-disabled={isDisabled || undefined}
        />
      </StyledItem>
      {helperText && (
        <StyledItemHelperText
          id={itemHelperTextId}
          data-disabled={isDisabled || undefined}
        >
          {helperText}
        </StyledItemHelperText>
      )}
    </>
  );
}
