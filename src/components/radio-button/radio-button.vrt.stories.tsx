import { disabledA11yParameters } from "../../../.storybook/a11y";
import preview from "../../../.storybook/preview";
import { RadioButtonItem, RadioGroup } from "./radio-button";

const meta = preview.meta({
  title: "VRT/RadioButton",
  component: RadioGroup,
  tags: ["!dev", "!autodocs"],
  args: {
    label: "通知方法",
    children: (
      <>
        <RadioButtonItem label="メール" value="email" />
        <RadioButtonItem label="SMS" value="sms" />
        <RadioButtonItem label="プッシュ通知" value="push" />
      </>
    ),
  },
});

export default meta;

// --- unchecked ---

export const Unchecked = meta.story({});

// --- checked ---

export const Checked = meta.story({
  args: { defaultValue: "email" },
});

// --- disabled ---

export const DisabledUnchecked = meta.story({
  args: { disabled: true },
  parameters: disabledA11yParameters,
});

export const DisabledChecked = meta.story({
  args: { defaultValue: "email", disabled: true },
  parameters: disabledA11yParameters,
});

// --- helperText ---

export const WithGroupHelperText = meta.story({
  args: {
    helperText: "通知を受け取る方法を選択してください",
  },
});

export const WithItemHelperText = meta.story({
  args: {
    children: (
      <>
        <RadioButtonItem label="メール" value="email" helperText="メールで通知を受け取ります" />
        <RadioButtonItem label="SMS" value="sms" helperText="SMSで通知を受け取ります" />
      </>
    ),
  },
});

// --- orientation ---

export const Horizontal = meta.story({
  args: { orientation: "horizontal" },
});

// --- individual disabled ---

export const ItemDisabled = meta.story({
  args: {
    children: (
      <>
        <RadioButtonItem label="メール" value="email" />
        <RadioButtonItem label="SMS" value="sms" disabled />
        <RadioButtonItem label="プッシュ通知" value="push" />
      </>
    ),
  },
  parameters: disabledA11yParameters,
});

// --- invalid ---

export const Invalid = meta.story({
  args: { invalid: true },
});

export const InvalidChecked = meta.story({
  args: { defaultValue: "email", invalid: true },
});

export const InvalidWithErrorText = meta.story({
  args: { invalid: true, errorText: "いずれかを選択してください" },
});

export const InvalidWithHelperAndErrorText = meta.story({
  args: {
    helperText: "通知を受け取る方法を選択してください",
    invalid: true,
    errorText: "いずれかを選択してください",
  },
});

export const InvalidDisabled = meta.story({
  args: { disabled: true, invalid: true, errorText: "このエラーは表示されない" },
  parameters: disabledA11yParameters,
});
