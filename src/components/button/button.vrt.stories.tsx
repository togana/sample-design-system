import { disabledA11yParameters } from "../../../.storybook/a11y";
import preview from "../../../.storybook/preview";
import { Button } from "./button";

const meta = preview.meta({
  title: "VRT/Button",
  component: Button,
  tags: ["!dev", "!autodocs"],
  args: {
    children: "ボタン",
  },
});

export default meta;

// --- styleType ---

export const Filled = meta.story({
  args: { styleType: "filled" },
});

export const Outlined = meta.story({
  args: { styleType: "outlined" },
});

export const Ghost = meta.story({
  args: { styleType: "ghost" },
});

export const Rectangle = meta.story({
  args: { styleType: "rectangle" },
});

// --- size ---

export const SizeMedium = meta.story({
  args: { size: "medium" },
});

export const SizeSmall = meta.story({
  args: { size: "small" },
});

// --- disabled ---

export const FilledDisabled = meta.story({
  args: { styleType: "filled", disabled: true },
  parameters: disabledA11yParameters,
});

export const OutlinedDisabled = meta.story({
  args: { styleType: "outlined", disabled: true },
  parameters: disabledA11yParameters,
});

export const GhostDisabled = meta.story({
  args: { styleType: "ghost", disabled: true },
  parameters: disabledA11yParameters,
});

export const RectangleDisabled = meta.story({
  args: { styleType: "rectangle", disabled: true },
  parameters: disabledA11yParameters,
});

// --- focus ---

export const FilledFocus = meta.story({
  args: { styleType: "filled" },
});

export const OutlinedFocus = meta.story({
  args: { styleType: "outlined" },
});

export const GhostFocus = meta.story({
  args: { styleType: "ghost" },
});

export const RectangleFocus = meta.story({
  args: { styleType: "rectangle" },
});

// --- disabled + focus ---

export const FilledDisabledFocus = meta.story({
  args: { styleType: "filled", disabled: true },
  parameters: disabledA11yParameters,
});

export const OutlinedDisabledFocus = meta.story({
  args: { styleType: "outlined", disabled: true },
  parameters: disabledA11yParameters,
});

export const GhostDisabledFocus = meta.story({
  args: { styleType: "ghost", disabled: true },
  parameters: disabledA11yParameters,
});

export const RectangleDisabledFocus = meta.story({
  args: { styleType: "rectangle", disabled: true },
  parameters: disabledA11yParameters,
});

// --- loading ---

export const FilledLoading = meta.story({
  args: { styleType: "filled", isLoading: true },
  parameters: disabledA11yParameters,
});

export const OutlinedLoading = meta.story({
  args: { styleType: "outlined", isLoading: true },
  parameters: disabledA11yParameters,
});

export const GhostLoading = meta.story({
  args: { styleType: "ghost", isLoading: true },
  parameters: disabledA11yParameters,
});

export const RectangleLoading = meta.story({
  args: { styleType: "rectangle", isLoading: true },
  parameters: disabledA11yParameters,
});
