"use client";

import { useId } from "react";
import {
  RadioGroup as ArkRadioGroup,
  useRadioGroupContext,
  type RadioGroupValueChangeDetails,
} from "@ark-ui/react/radio-group";
import { createStyleContext } from "@styled/jsx/create-style-context";
import { styled } from "@styled/jsx";
import { radioButtonRecipe } from "./radio-button.recipe";

const { withProvider, withContext } = createStyleContext(radioButtonRecipe);

const StyledRoot = withProvider(ArkRadioGroup.Root, "root");
const StyledLabel = withContext(ArkRadioGroup.Label, "label");
const StyledItem = withContext(ArkRadioGroup.Item, "item");
const StyledItemControl = withContext(ArkRadioGroup.ItemControl, "itemControl");
const StyledItemText = withContext(ArkRadioGroup.ItemText, "itemText");
const StyledItemGroup = withContext(styled("div"), "itemGroup");
const StyledHelperText = withContext(styled("p"), "helperText");
const StyledItemHelperText = withContext(styled("p"), "itemHelperText");

export type RadioGroupProps = {
  label: string;
  helperText?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (details: RadioGroupValueChangeDetails) => void;
  disabled?: boolean;
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
    orientation = "vertical",
    children,
    ...rootProps
  } = props;

  const helperTextId = useId();

  return (
    // RadioGroup は readOnly 時にフォーカスリングが出ないため、
    // Checkbox と異なり Ark UI の disabled をそのまま使用する
    <StyledRoot
      disabled={disabled}
      orientation={orientation}
      aria-describedby={helperText ? helperTextId : undefined}
      {...rootProps}
    >
      <StyledLabel>{label}</StyledLabel>
      {helperText && (
        <StyledHelperText id={helperTextId}>
          {helperText}
        </StyledHelperText>
      )}
      <StyledItemGroup data-orientation={orientation}>
        {children}
      </StyledItemGroup>
    </StyledRoot>
  );
}

export function RadioButtonItem(props: RadioButtonItemProps) {
  const { label, value, helperText, disabled = false } = props;
  const groupContext = useRadioGroupContext();
  const itemState = groupContext.getItemState({ value, disabled });

  return (
    <>
      <StyledItem value={value} disabled={disabled}>
        <StyledItemControl />
        <StyledItemText>{label}</StyledItemText>
        <ArkRadioGroup.ItemHiddenInput />
      </StyledItem>
      {/* itemHelperText は Ark UI パーツ外のため data-disabled を手動付与 */}
      {helperText && (
        <StyledItemHelperText data-disabled={itemState.disabled || undefined}>
          {helperText}
        </StyledItemHelperText>
      )}
    </>
  );
}
