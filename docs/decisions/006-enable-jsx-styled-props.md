# ADR-006: Panda CSS の JSX styled props を有効にする

- ステータス: 承認済み
- 日付: 2026-02-22

## コンテキスト

これまで Panda CSS の `jsxFramework` を設定しておらず、スタイルの適用は `css()` 関数で行っていた。

`styled` ファクトリを使うことで、JSX 要素に直接スタイルプロパティを渡せるようになり、コンポーネント開発の記述量を削減できる。また、`createStyleContext` を使うことで `sva` のスロットスタイルも `css()` なしで適用できる。

## 決定

`panda.config.ts` に `jsxFramework: "react"` を追加し、`styled` ファクトリによる styled props を有効にする。

### 設定の変更

```ts
export default defineConfig({
  presets: ["@pandacss/preset-base"],
  jsxFramework: "react",
  // ...
});
```

### スタイリング方針

スタイルの適用は以下の手法に統一し、`css()` 関数は原則使わない。

| パターン | 手法 |
|----------|------|
| 基本スタイリング | `styled.div`, `styled.button` 等の styled props |
| バリアント付きコンポーネント | `cva` + `styled("button", recipe)` |
| スロット付きコンポーネント | `sva` + `createStyleContext` |

### 使わないもの

- **`css()` 関数**: 上記の手法で対応できるため原則使わない
- **パターンコンポーネント**: `Box`, `Flex`, `Stack` 等は使用せず、`styled` ファクトリで構成する

### 使用例

```tsx
import { sva } from "../styled-system/css";
import { styled, createStyleContext } from "../styled-system/jsx";

// styled ファクトリ
<styled.div display="flex" gap="4" alignItems="center">
  <styled.span>Item 1</styled.span>
</styled.div>

// cva + styled
const buttonRecipe = cva({
  base: { px: "4", py: "2", borderRadius: "md" },
  variants: {
    variant: {
      primary: { bg: "primary", color: "white" },
    },
  },
});
const Button = styled("button", buttonRecipe);
<Button variant="primary">Click</Button>

// sva + createStyleContext
const card = sva({
  slots: ["root", "label"],
  base: {
    root: { p: "4" },
    label: { fontWeight: "bold" },
  },
});
const { withProvider, withContext } = createStyleContext(card);
const CardRoot = withProvider("div", "root");
const CardLabel = withContext("span", "label");
```

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| jsxFramework | `react` | プロジェクトが React (Next.js) を使用しているため |
| styled ファクトリ | 優先的に使用する | JSX に直接スタイルを渡せることで記述量が減り、可読性が向上するため |
| cva / sva | 使用する | コンポーネントのバリアント管理に必要であり、デザインシステムの一貫性を担保するため |
| createStyleContext | sva と組み合わせて使用する | スロットスタイルを React コンテキスト経由で自動配布でき、css() 関数が不要になるため。Ark UI との親和性も高い |
| css() 関数 | 原則使わない | styled ファクトリ・cva・sva + createStyleContext に統一することで、スタイリング手法の一貫性を保つため |
| パターンコンポーネント | 使用しない | styled ファクトリで同等のことが実現でき、API の選択肢を絞ることで一貫性を保つため |
