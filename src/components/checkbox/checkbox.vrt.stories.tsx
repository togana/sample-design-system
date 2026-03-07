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

// --- focus ---

export const UncheckedFocus = meta.story({
  args: { checked: false },
});

export const CheckedFocus = meta.story({
  args: { checked: true },
});

// --- disabled + focus ---

export const DisabledUncheckedFocus = meta.story({
  args: { checked: false, disabled: true },
});

export const DisabledCheckedFocus = meta.story({
  args: { checked: true, disabled: true },
});

// --- helperText ---

export const WithHelperText = meta.story({
  args: { helperText: "補足テキスト" },
});

export const CheckedWithHelperText = meta.story({
  args: { checked: true, helperText: "補足テキスト" },
});

// --- invalid ---

export const Invalid = meta.story({
  args: { invalid: true },
});

export const InvalidChecked = meta.story({
  args: { checked: true, invalid: true },
});

export const InvalidWithErrorText = meta.story({
  args: { invalid: true, errorText: "同意が必要です" },
});

export const InvalidWithHelperAndErrorText = meta.story({
  args: {
    helperText: "補足テキスト",
    invalid: true,
    errorText: "同意が必要です",
  },
});

export const InvalidDisabled = meta.story({
  args: { invalid: true, errorText: "このエラーは表示されない", disabled: true },
});
