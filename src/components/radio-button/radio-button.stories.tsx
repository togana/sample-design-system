import { expect, fn, userEvent, within } from "storybook/test";
import preview from "../../../.storybook/preview";
import { RadioButtonItem, RadioGroup } from "./radio-button";
import { RadioButtonDocsPage } from "./radio-button.docs";

const meta = preview.meta({
  title: "Components/RadioButton",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: RadioButtonDocsPage,
    },
  },
  argTypes: {
    label: {
      description: "グループのラベル",
    },
    helperText: {
      description: "グループの補足テキスト",
    },
    value: {
      description: "選択値（制御モード）",
    },
    defaultValue: {
      description: "初期選択値（非制御モード）",
    },
    onValueChange: {
      description: "選択変更時のコールバック",
    },
    disabled: {
      description: "グループ全体の非活性状態",
      table: { defaultValue: { summary: "false" } },
    },
    name: {
      description: "フォーム送信時のフィールド名",
    },
    orientation: {
      description: "項目の配置方向",
      table: { defaultValue: { summary: '"vertical"' } },
    },
    children: {
      description: "RadioButtonItem を配置",
      table: { disable: true },
    },
  },
  args: {
    label: "通知方法",
    onValueChange: fn(),
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

// --- インタラクションテスト ---

export const SelectInteraction = meta.story({
  name: "Select Interaction",
  tags: ["!dev"],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", { name: "メール" });
    await userEvent.click(radio);
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await expect(args.onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "email" }),
    );
  },
});

export const ExclusiveSelection = meta.story({
  name: "Exclusive Selection",
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailRadio = canvas.getByRole("radio", { name: "メール" });
    const smsRadio = canvas.getByRole("radio", { name: "SMS" });

    await userEvent.click(emailRadio);
    await expect(emailRadio).toBeChecked();

    await userEvent.click(smsRadio);
    await expect(smsRadio).toBeChecked();
    await expect(emailRadio).not.toBeChecked();
  },
});

export const DisabledClickBlocked = meta.story({
  name: "Disabled Click Blocked",
  tags: ["!dev"],
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", { name: "メール" });
    await userEvent.click(radio);
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
});

export const KeyboardNavigation = meta.story({
  name: "Keyboard Navigation",
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailRadio = canvas.getByRole("radio", { name: "メール" });

    await userEvent.click(emailRadio);
    await expect(emailRadio).toBeChecked();

    await userEvent.keyboard("{ArrowDown}");
    const smsRadio = canvas.getByRole("radio", { name: "SMS" });
    await expect(smsRadio).toBeChecked();
  },
});
