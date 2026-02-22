import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    colorScheme: {
      control: { type: "select" },
      options: ["brand", "danger"],
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    onClick: fn(),
    children: "ボタン",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- バリアント ---

export const Solid: Story = {
  args: {
    variant: "solid",
    children: "保存",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "キャンセル",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "詳細",
  },
};

// --- サイズ ---

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

// --- カラースキーム ---

export const Danger: Story = {
  args: {
    colorScheme: "danger",
    variant: "solid",
    children: "削除",
  },
};

export const DangerOutline: Story = {
  name: "Danger (Outline)",
  args: {
    colorScheme: "danger",
    variant: "outline",
    children: "キャンセル",
  },
};

export const DangerGhost: Story = {
  name: "Danger (Ghost)",
  args: {
    colorScheme: "danger",
    variant: "ghost",
    children: "削除",
  },
};

// --- 状態 ---

export const Loading: Story = {
  args: {
    loading: true,
    children: "保存中...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "送信不可",
  },
};

// --- アイコン ---

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3a.75.75 0 0 1 0-1.5h8.19L8.22 4.03a.75.75 0 0 1 0-1.06Z"
    />
  </svg>
);

export const WithLeftIcon: Story = {
  name: "Left Icon",
  args: {
    leftIcon: <PlusIcon />,
    children: "追加",
  },
};

export const WithRightIcon: Story = {
  name: "Right Icon",
  args: {
    rightIcon: <ArrowRightIcon />,
    children: "次へ",
  },
};

export const WithBothIcons: Story = {
  name: "Both Icons",
  args: {
    leftIcon: <PlusIcon />,
    rightIcon: <ArrowRightIcon />,
    children: "追加して次へ",
  },
};

// --- インタラクションテスト ---

export const ClickTest: Story = {
  name: "Click Test",
  args: {
    children: "クリックテスト",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "クリックテスト" });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledClickTest: Story = {
  name: "Disabled Click Prevention",
  args: {
    disabled: true,
    children: "無効ボタン",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "無効ボタン" });

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LoadingClickTest: Story = {
  name: "Loading Click Prevention",
  args: {
    loading: true,
    children: "ローディング中",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "ローディング中" });

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
