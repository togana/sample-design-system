import { expect, fn, userEvent, within } from "storybook/test";
import preview from "../../../.storybook/preview";
import { Checkbox } from "./checkbox";
import { CheckboxDocsPage } from "./checkbox.docs";

const meta = preview.meta({
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: CheckboxDocsPage,
    },
  },
  argTypes: {
    label: {
      description: "チェックボックスのラベル",
    },
    helperText: {
      description: "ラベル下部の補足テキスト",
    },
    checked: {
      description:
        "チェック状態（制御モード）。`true` でチェック、`false` で未チェック、`\"indeterminate\"` で不確定状態",
    },
    defaultChecked: {
      description:
        "初期チェック状態（非制御モード）。`checked` を指定しない場合に使用する",
    },
    onCheckedChange: {
      description: "チェック状態が変わったときのコールバック",
    },
    disabled: {
      description: "非活性状態。フォーカスは維持されるが操作はできない",
      table: { defaultValue: { summary: "false" } },
    },
    name: {
      description: "フォーム送信時のフィールド名",
    },
    value: {
      description: "フォーム送信時の値",
      table: { defaultValue: { summary: '"on"' } },
    },
  },
  args: {
    label: "チェックボックス",
    onCheckedChange: fn(),
  },
});

export default meta;

// --- インタラクションテスト ---

export const ToggleInteraction = meta.story({
  name: "Toggle Interaction",
  tags: ["!dev"],
  args: { label: "同意する" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: "同意する" });
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true }),
    );
  },
});

export const DisabledClickBlocked = meta.story({
  name: "Disabled Click Blocked",
  tags: ["!dev"],
  args: { label: "無効", disabled: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: "無効" });
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
    await expect(checkbox).toHaveAttribute("aria-disabled", "true");
  },
});

export const IndeterminateState = meta.story({
  name: "Indeterminate State",
  tags: ["!dev"],
  args: { label: "すべて選択", checked: "indeterminate" },
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector("[data-state=indeterminate]");
    await expect(control).not.toBeNull();
  },
});
