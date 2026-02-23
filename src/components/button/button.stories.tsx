import { expect, fn, userEvent, within } from "storybook/test";

import preview from "../../../.storybook/preview";
import { Button } from "./button";
import { ButtonDocsPage } from "./button.docs";

const meta = preview.meta({
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      page: ButtonDocsPage,
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
      description: "ボタンの視覚スタイル",
      table: { type: { summary: '"solid" | "outline" | "ghost"' }, defaultValue: { summary: '"solid"' } },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "ボタンのサイズ",
      table: { type: { summary: '"sm" | "md" | "lg"' }, defaultValue: { summary: '"md"' } },
    },
    colorScheme: {
      control: { type: "select" },
      options: ["brand", "danger"],
      description: "カラースキーム",
      table: { type: { summary: '"brand" | "danger"' }, defaultValue: { summary: '"brand"' } },
    },
    loading: {
      control: { type: "boolean" },
      description: "ローディング状態。Spinner を表示しクリックを無効化する",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    disabled: {
      control: { type: "boolean" },
      description: "無効状態。aria-disabled を設定しクリックを無効化する",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    onClick: {
      description: "クリック時のコールバック",
      table: { type: { summary: "(e: MouseEvent) => void" } },
    },
    children: {
      description: "ボタンのラベルテキスト",
      table: { type: { summary: "ReactNode" } },
    },
    leftIcon: {
      description: "ボタン左側に表示するアイコン",
      table: { type: { summary: "ReactNode" } },
    },
    rightIcon: {
      description: "ボタン右側に表示するアイコン",
      table: { type: { summary: "ReactNode" } },
    },
  },
  args: {
    onClick: fn(),
    children: "ボタン",
  },
});

// --- バリアント ---

export const Solid = meta.story({
  args: {
    variant: "solid",
    children: "保存",
  },
});

export const Outline = meta.story({
  args: {
    variant: "outline",
    children: "キャンセル",
  },
});

export const Ghost = meta.story({
  args: {
    variant: "ghost",
    children: "詳細",
  },
});

// --- サイズ ---

export const Small = meta.story({
  args: {
    size: "sm",
    children: "Small",
  },
});

export const Medium = meta.story({
  args: {
    size: "md",
    children: "Medium",
  },
});

export const Large = meta.story({
  args: {
    size: "lg",
    children: "Large",
  },
});

// --- カラースキーム ---

export const Danger = meta.story({
  args: {
    colorScheme: "danger",
    variant: "solid",
    children: "削除",
  },
});

export const DangerOutline = meta.story({
  name: "Danger (Outline)",
  args: {
    colorScheme: "danger",
    variant: "outline",
    children: "キャンセル",
  },
});

export const DangerGhost = meta.story({
  name: "Danger (Ghost)",
  args: {
    colorScheme: "danger",
    variant: "ghost",
    children: "削除",
  },
});

// --- 状態 ---

export const Loading = meta.story({
  args: {
    loading: true,
    children: "保存中...",
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    children: "送信不可",
  },
});

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

export const WithLeftIcon = meta.story({
  name: "Left Icon",
  args: {
    leftIcon: <PlusIcon />,
    children: "追加",
  },
});

export const WithRightIcon = meta.story({
  name: "Right Icon",
  args: {
    rightIcon: <ArrowRightIcon />,
    children: "次へ",
  },
});

export const WithBothIcons = meta.story({
  name: "Both Icons",
  args: {
    leftIcon: <PlusIcon />,
    rightIcon: <ArrowRightIcon />,
    children: "追加して次へ",
  },
});

// --- インタラクションテスト ---

export const ClickTest = meta.story({
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
});

export const DisabledClickTest = meta.story({
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
});

export const LoadingClickTest = meta.story({
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
});
