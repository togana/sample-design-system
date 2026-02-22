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
src/components/{Name}/
├── index.ts              # re-export
├── {Name}.tsx            # メインコンポーネント
├── {Name}.recipe.ts      # Panda CSS レシピ (cva)
├── {Name}.test.tsx       # テスト
└── {Name}.stories.tsx    # Storybook（対応した場合）
```

- `{Name}` は PascalCase（例: `Button`, `TextField`）
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
- Ark UI の Props 型をそのまま公開し、独自の Props 型で包まない
- `asChild` による polymorphic レンダリングを維持する
- Ark UI が提供する a11y（ARIA 属性、キーボード操作、フォーカス管理）をそのまま活用する
- Ark UI が対応していない振る舞いのみカスタム実装する

## Panda CSS スタイリングルール

### レシピ定義

- `cva()` (Class Variance Authority パターン) でバリアントを定義する
- レシピは `{Name}.recipe.ts` に分離する
- `{Name}.tsx` からレシピを import して適用する

### レシピの構成

```ts
import { cva } from "../../styled-system/css";

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

### 禁止事項

- インラインスタイル (`css({})`) はレシピで対応できない場合のみ使用する
- `style` prop による直接スタイル指定は禁止
- レシピ内で生の値（`"16px"`, `"#333"` 等）を使わない

## コンポーネント実装パターン

```tsx
"use client";

import { Button as ArkButton } from "@ark-ui/react";
import type { ButtonProps as ArkButtonProps } from "@ark-ui/react";
import { buttonRecipe } from "./Button.recipe";

export interface ButtonProps extends ArkButtonProps {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = (props: ButtonProps) => {
  const { variant, size, className, ...rest } = props;
  return (
    <ArkButton
      className={buttonRecipe({ variant, size })}
      {...rest}
    />
  );
};
```

## アクセシビリティ要件

- Ark UI が提供するキーボード操作をそのまま維持する（上書きしない）
- カスタム要素には必ず適切な ARIA 属性を付与する
- フォーカスリングは visible にする（`outline` を消さない）
- `focus-visible` でフォーカスリングを表示する
- カラーコントラストは WCAG AA 以上（通常テキスト 4.5:1、大テキスト 3:1）
- icon-only の要素には `aria-label` を必須にする

## 作業手順

### 1. 要件の確認

- 対応する ADR があれば読み、MVP スコープを確認する
- バリアント、サイズ、状態の一覧を確認する

### 2. トークンの確認・追加

- 必要なセマンティックトークンが揃っているか `src/tokens/semantic-*.ts` を確認する
- 不足がある場合は先にトークンを追加する

### 3. レシピの作成

- `src/components/{Name}/{Name}.recipe.ts` を作成する
- `cva()` でバリアント定義を実装する
- セマンティックトークンを参照する

### 4. コンポーネントの実装

- `src/components/{Name}/{Name}.tsx` を作成する
- Ark UI のコンポーネントをベースに、レシピを適用する
- `'use client'` ディレクティブを付ける（必要な場合）

### 5. エクスポート

- `src/components/{Name}/index.ts` で re-export する

### 6. 検証

必ず以下を実行して成功を確認する:

```bash
npx panda codegen
npx tsc --noEmit
```

### 7. 報告

生成したファイル一覧とコンポーネント API を報告し、AskUserQuestion でコミットするか確認する。
