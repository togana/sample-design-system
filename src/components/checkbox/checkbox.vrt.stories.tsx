import preview from "../../../.storybook/preview";
import { Checkbox } from "./checkbox";

const meta = preview.meta({
  title: "VRT/Checkbox",
  component: Checkbox,
  tags: ["!dev", "!autodocs"],
  args: {
    label: "チェックボックス",
  },
});

export default meta;

// --- checked ---

export const Unchecked = meta.story({
  args: { checked: false },
});

export const Checked = meta.story({
  args: { checked: true },
});

export const Indeterminate = meta.story({
  args: { checked: "indeterminate" },
});

// --- disabled ---

export const UncheckedDisabled = meta.story({
  args: { checked: false, disabled: true },
});

export const CheckedDisabled = meta.story({
  args: { checked: true, disabled: true },
});

export const IndeterminateDisabled = meta.story({
  args: { checked: "indeterminate", disabled: true },
});

// --- helperText ---

export const WithHelperText = meta.story({
  args: { helperText: "補足テキスト" },
});

export const CheckedWithHelperText = meta.story({
  args: { checked: true, helperText: "補足テキスト" },
});
