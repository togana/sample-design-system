import { expect, fn, userEvent, within } from "storybook/test";
import { disabledA11yParameters } from "../../../.storybook/a11y";
import preview from "../../../.storybook/preview";
import { Button } from "./button";
import { ButtonDocsPage } from "./button.docs";

const meta = preview.meta({
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: ButtonDocsPage,
    },
  },
  argTypes: {
    children: {
      description: "ボタンのラベル",
    },
    styleType: {
      description: "ボタンのスタイルバリアント",
      table: { defaultValue: { summary: '"filled"' } },
    },
    size: {
      description: "ボタンのサイズ",
      table: { defaultValue: { summary: '"medium"' } },
    },
    disabled: {
      description: "非活性状態",
      table: { defaultValue: { summary: "false" } },
    },
    isLoading: {
      description:
        "ローディング状態。Spinner を表示しクリックをブロックする",
      table: { defaultValue: { summary: "false" } },
    },
    leftIcon: {
      description: "ラベル左側に表示するアイコン。`rightIcon` と排他",
    },
    rightIcon: {
      description: "ラベル右側に表示するアイコン。`leftIcon` と排他",
    },
    onClick: {
      description: "クリック時のコールバック",
    },
  },
  args: {
    children: "ボタン",
    onClick: fn(),
  },
});

export default meta;

// --- インタラクションテスト ---

export const ClickInteraction = meta.story({
  name: "Click Interaction",
  tags: ["!dev"],
  args: { children: "クリック" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "クリック" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
});

export const DisabledClickBlocked = meta.story({
  name: "Disabled Click Blocked",
  tags: ["!dev"],
  args: { children: "無効", disabled: true },
  parameters: disabledA11yParameters,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "無効" });
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button).toBeDisabled();
  },
});

export const LoadingClickBlocked = meta.story({
  name: "Loading Click Blocked",
  tags: ["!dev"],
  args: { children: "読込中", isLoading: true },
  parameters: disabledA11yParameters,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "読込中" });
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
  },
});
