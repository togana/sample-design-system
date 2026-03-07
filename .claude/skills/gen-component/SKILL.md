---
name: gen-component
description: Ark UI + Panda CSS のコンポーネント生成ルールに従って、新しいコンポーネントを作成する
argument-hint: <コンポーネント名と要件>
---

$ARGUMENTS の内容に基づいてコンポーネントを生成してください。

## 技術スタック

- ヘッドレス UI: Ark UI (`@ark-ui/react`)
- スタイリング: Panda CSS (`styled-system` から import)
- フレームワーク: React (Server Components 非対応のものは `'use client'` を付ける)

## ファイル構成

各コンポーネントは以下のディレクトリ構成で作成する:

```
src/components/{name}/
├── index.ts              # re-export
├── {name}.tsx            # メインコンポーネント
├── {name}.recipe.ts      # Panda CSS レシピ (cva)
├── {name}.docs.tsx           # Storybook Docs ページ（/gen-component-doc で生成）
├── {name}.vrt.stories.tsx   # VRT 専用ストーリー（/gen-component-doc で生成）
├── {name}.test.tsx           # テスト
└── {name}.stories.tsx        # Storybook ストーリー
```

- `{name}` はケバブケース（例: `button`, `text-field`）
- `index.ts` はコンポーネントと型を re-export する

## トークンルール

### カラー

- **必ずセマンティックトークンを使う**
- Panda CSS の `token()` または `colorPalette` で参照する
- 禁止: 生の Hex 値（`#ff0000`）、プリミティブトークンの直接使用（`colors.blue.600`）

### スペーシング

- セマンティックスペーシングトークンを使う（`spacing.component.sm`, `spacing.component.md` 等）
- レシピ内で直接数値を指定しない

### 不足トークンの対応

- 必要なセマンティックトークンが不足している場合、先にトークンを追加する
- トークン追加は `/add-token` スキルの規約に従う

## Ark UI 統合ルール

- Ark UI のヘッドレスコンポーネントをベースにする
- Ark UI に対応するコンポーネントが存在しない場合は、ネイティブ HTML 要素をベースに a11y を自前で担保する
- Ark UI の Props 型をそのまま公開し、独自の Props 型で包まない
- `asChild` による polymorphic レンダリングを維持する
- Ark UI が提供する a11y（ARIA 属性、キーボード操作、フォーカス管理）をそのまま活用する
- Ark UI が対応していない振る舞いのみカスタム実装する

## Panda CSS スタイリングルール

### レシピ定義

- 単一パーツコンポーネント: `cva()` でバリアントを定義する
- 複合パーツコンポーネント: `sva()` でスロット + バリアントを定義する
- レシピは `{name}.recipe.ts` に分離する
- `{name}.tsx` からレシピを import し、`styled` ファクトリまたは `createStyleContext` で適用する

### レシピの構成

```ts
import { cva } from "../../../styled-system/css";

export const buttonRecipe = cva({
  base: {
    // 全バリアント共通のスタイル
  },
  variants: {
    variant: {
      solid: { /* ... */ },
      outline: { /* ... */ },
    },
    size: {
      sm: { /* ... */ },
      md: { /* ... */ },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
```

### compoundVariants の使用

`variant` と `colorScheme` など、複数のバリアント軸の組み合わせでスタイルが決まる場合は `compoundVariants` を使う:

```ts
export const buttonRecipe = cva({
  variants: {
    variant: {
      solid: {},
      outline: { borderWidth: "1px", borderStyle: "solid", backgroundColor: "transparent" },
    },
    colorScheme: {
      brand: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      colorScheme: "brand",
      css: {
        backgroundColor: "bg.fill.brand",
        color: "text.onFill",
        _hover: { backgroundColor: "bg.fill.brand.hover" },
        _active: { backgroundColor: "bg.fill.brand.hover" },
      },
    },
    // variant × colorScheme の全組み合わせを列挙する
  ],
});
```

> **備考**: `panda.config.ts` で `_hover` / `_active` を `:not([data-disabled])` 付きに上書き済みのため、disabled 時の hover/active は自動的に無効化される。カスタムセレクタは不要。

### styled ファクトリの使用（ADR-006）

スタイルの適用は `styled` ファクトリに統一し、`css()` 関数は使わない。

| パターン | 手法 |
|----------|------|
| 基本スタイリング | `styled.div`, `styled.button` 等の styled props |
| バリアント付きコンポーネント（単一パーツ） | `cva` + `styled("button", recipe)` |
| スロット付きコンポーネント（複合パーツ） | `sva` + `createStyleContext` |

### 禁止事項

- `css()` 関数の使用（`styled` ファクトリで代替する）
- パターンコンポーネント（`Box`, `Flex`, `Stack` 等）の使用（`styled` ファクトリで代替する）
- `style` prop による直接スタイル指定
- レシピ内で生の値（`"16px"`, `"#333"` 等）を使う

## コンポーネント実装パターン

### 単一パーツ: Ark UI にコンポーネントがある場合

`styled(ark.element, recipe)` で Ark UI コンポーネントにスタイルを適用する。

```tsx
"use client";

import { ark } from "@ark-ui/react/factory";
import { styled } from "../../../styled-system/jsx";
import { buttonRecipe } from "./button.recipe";

const BaseButton = styled(ark.button, buttonRecipe);

// Ark UI の Props 型をそのまま公開する
```

### 単一パーツ: Ark UI にコンポーネントがない場合

`styled("element", recipe)` でネイティブ HTML 要素にレシピを適用する。

```tsx
"use client";

import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx";
import { buttonRecipe } from "./button.recipe";

const StyledButton = styled("button", buttonRecipe);

// Props は明示的に type で定義する（ComponentProps からの Omit/継承はしない）
export type ButtonProps = {
  /** ボタンのラベル */
  children: ReactNode;
  /**
   * スタイルバリアント。
   * @default "solid"
   */
  variant?: "solid" | "outline";
  // ... 他の props
};

export function Button(props: ButtonProps) {
  const { children, variant, ...rest } = props;
  return (
    <StyledButton variant={variant} {...rest}>
      {children}
    </StyledButton>
  );
}
```

### 複合パーツ（スロット付き）: sva + createStyleContext

複数のパーツを持つコンポーネントは `sva` + `createStyleContext` で構成する。

```tsx
"use client";

import { Accordion } from "@ark-ui/react/accordion";
import { createStyleContext } from "../../../styled-system/jsx";
import { accordionRecipe } from "./accordion.recipe";

const { withProvider, withContext } = createStyleContext(accordionRecipe);

export const Root = withProvider(Accordion.Root, "root");
export const Item = withContext(Accordion.Item, "item");
export const ItemTrigger = withContext(Accordion.ItemTrigger, "itemTrigger");
export const ItemContent = withContext(Accordion.ItemContent, "itemContent");
```

## アクセシビリティ要件

- Ark UI が提供するキーボード操作をそのまま維持する（上書きしない）
- カスタム要素には必ず適切な ARIA 属性を付与する
- フォーカスリングは visible にする（`outline` を消さない）
- `focus-visible` でフォーカスリングを表示する
- カラーコントラストは WCAG AA 以上（通常テキスト 4.5:1、大テキスト 3:1）
- icon-only の要素には `aria-label` を必須にする
- disabled 状態は `aria-disabled` の使用を推奨する（HTML `disabled` 属性ではなく）

### aria-disabled + クリックブロックパターン

`aria-disabled` を使用する場合、HTML `disabled` 属性と異なりクリックイベントは発火する。`onClick` ハンドラ内で明示的にブロックする:

```tsx
const isDisabled = disabled || loading;

const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  if (isDisabled) {
    e.preventDefault();
    return;
  }
  onClick?.(e);
};

<StyledButton
  aria-disabled={isDisabled || undefined}
  data-disabled={isDisabled || undefined}
  onClick={handleClick}
/>
```

- `data-disabled` を付与することで Panda CSS の `_disabled` 条件セレクタが動作する
- `aria-disabled` は `true` のときのみ付与する（`false` を渡さない）

### ローディング状態のパターン

ローディング中は内部 `Spinner` コンポーネントを表示し、クリックをブロックする:

```tsx
function Spinner() {
  return (
    <styled.svg
      animation="spin 0.6s linear infinite"
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="10"
      />
    </styled.svg>
  );
}
```

- `aria-hidden="true"` でスクリーンリーダーから隠す
- `aria-busy={loading}` をコンポーネント本体に設定する
- ローディング中は `onClick` をブロックする（`disabled` と同様に `isDisabled` で統合する）
- `panda.config.ts` に `spin` キーフレームが定義済み

## 作業手順

### 1. 要件の確認

- 対応する ADR があれば読み、MVP スコープを確認する
- バリアント、サイズ、状態の一覧を確認する

### 2. トークンの確認・追加

- 必要なセマンティックトークンが揃っているか `src/preset/theme/semantic-tokens/` を確認する
- 不足がある場合は先にトークンを追加する

### 3. レシピの作成

- `src/components/{name}/{name}.recipe.ts` を作成する
- `cva()` でバリアント定義を実装する
- セマンティックトークンを参照する

### 4. コンポーネントの実装

- `src/components/{name}/{name}.tsx` を作成する
- Ark UI のコンポーネントをベースに、レシピを適用する
- Ark UI に対応コンポーネントがない場合はネイティブ HTML 要素を使用する
- `'use client'` ディレクティブを付ける（必要な場合）

### 5. エクスポート

- `src/components/{name}/index.ts` で re-export する

### 6. Storybook ストーリーの作成

`src/components/{name}/{name}.stories.tsx` を作成する。

**stories の役割はインタラクションテスト専用。** バリアント・サイズ・状態のビジュアルショーケースは `docs.tsx` に集約する。

- `play` 関数付きのインタラクションテストを書く（クリック、disabled/loading 時の挙動など）
- インタラクションテストには `tags: ["!dev"]` を付けてサイドバーから非表示にする
- Storybook 10 のポータブルストーリーパターンを使う（`Meta`, `StoryObj` は **使わない**）
- `argTypes` で全 props の `description` を設定する
- デフォルト値がある props には `table.defaultValue.summary` も設定する

```tsx
import { expect, fn, userEvent, within } from "storybook/test";
import preview from "../../../.storybook/preview";
import { MyComponent } from "./my-component";
import { MyComponentDocsPage } from "./my-component.docs";

const meta = preview.meta({
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: MyComponentDocsPage,
    },
  },
  argTypes: {
    children: {
      description: "ボタンのラベル",
    },
    disabled: {
      description: "非活性状態",
      table: { defaultValue: { summary: "false" } },
    },
    variant: {
      description: "スタイルバリアント",
      table: { defaultValue: { summary: '"solid"' } },
    },
  },
  args: { onClick: fn() },
});

export default meta;

// インタラクションテスト（サイドバー非表示）
export const ClickInteraction = meta.story({
  name: "Click Interaction",
  tags: ["!dev"],
  args: { children: "テスト" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByRole("button", { name: "テスト" });
    await userEvent.click(el);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
});
```

### 7. Docs ページ・VRT ストーリーの生成

ストーリー作成後、`/gen-component-doc` スキルを実行して以下を生成する:

- `{name}.docs.tsx` — カスタム Docs ページ（ビジュアルショーケース、Do/Don't、アクセシビリティ情報）
- `{name}.vrt.stories.tsx` — VRT 専用ストーリー（props のバリアント別に静的な描画のみ）

stories.tsx の `parameters.docs.page` で Docs タブに接続する。

### 8. 検証

必ず以下を実行して成功を確認する:

```bash
npx panda codegen
npx tsc --noEmit
npm run build-storybook
npm run test:storybook
npm run test:vrt:update  # VRT ベースラインを生成
```

### 9. 品質監査

`/component-audit` スキルを実行し、生成したコンポーネントの品質を検証する。critical の指摘があれば修正してから次のステップに進む。

### 10. 報告

生成したファイル一覧とコンポーネント API を報告し、AskUserQuestion でコミットするか確認する。