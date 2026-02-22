---
name: component-audit
description: Panda CSS + Ark UI コンポーネントの品質監査
argument-hint: <監査対象のコンポーネント名またはパス>
---

$ARGUMENTS で指定されたコンポーネントを監査してください。指定がない場合は `src/components/` 配下の全コンポーネントを対象にする。

## 監査対象ファイルの読み込み

対象コンポーネントの以下のファイルをすべて読む:

- `{name}.tsx` — メインコンポーネント
- `{name}.recipe.ts` — Panda CSS レシピ
- `index.ts` — re-export

## チェック項目

### 1. トークン準拠

| # | チェック内容 | 深刻度 |
|---|------------|--------|
| T1 | ハードコード値がないか（Hex `#fff`, px `16px`, font-size `14px` 等） | critical |
| T2 | プリミティブトークンの直接使用がないか（`colors.blue.600` 等） | critical |
| T3 | セマンティックトークンが正しく使われているか（ADR-001 の命名式に準拠） | warning |
| T4 | ダークモード対応が漏れていないか（`base` / `_dark` の両方が定義されているか） | warning |

### 2. Ark UI 統合

| # | チェック内容 | 深刻度 |
|---|------------|--------|
| A1 | Ark UI のヘッドレスコンポーネントをベースにしているか（Ark UI に対応コンポーネントがない場合はネイティブ HTML 要素で可） | critical |
| A2 | Ark UI の Props 型がそのまま公開されているか（独自の Props 型で包んでいないか） | warning |
| A3 | `asChild` による polymorphic レンダリングが維持されているか | warning |
| A4 | Ark UI の a11y 機能（ARIA 属性、キーボード操作、フォーカス管理）が上書きされていないか | critical |

### 3. Panda CSS スタイリング

| # | チェック内容 | 深刻度 |
|---|------------|--------|
| P1 | `cva()` でバリアントが定義されているか | critical |
| P2 | レシピが `{name}.recipe.ts` に分離されているか | warning |
| P3 | インラインスタイル (`css({})`) がレシピで対応可能な箇所に使われていないか | warning |
| P4 | `style` prop による直接スタイル指定がないか | critical |
| P5 | レシピ内で `token()` またはセマンティックトークン参照を使っているか | warning |

### 4. アクセシビリティ

| # | チェック内容 | 深刻度 |
|---|------------|--------|
| X1 | キーボード操作: Tab, Enter, Space, Escape が適切に動作するか | critical |
| X2 | ARIA 属性: `role`, `aria-label`, `aria-expanded`, `aria-disabled` 等が適切か | critical |
| X3 | カラーコントラスト: テキスト 4.5:1、大テキスト 3:1（WCAG AA）を満たすか | warning |
| X4 | フォーカスリングが `focus-visible` で visible になっているか（`outline: none` で消していないか） | critical |
| X5 | icon-only の要素に `aria-label` が付与されているか | critical |
| X6 | disabled 状態で `aria-disabled` を使っているか（HTML `disabled` 属性ではなく） | info |

### 5. ファイル構成

| # | チェック内容 | 深刻度 |
|---|------------|--------|
| F1 | `src/components/{name}/` 配下に配置されているか（ケバブケース） | warning |
| F2 | `index.ts` で re-export されているか | warning |
| F3 | `'use client'` ディレクティブが必要なコンポーネントに付与されているか | critical |
| F4 | `.pen` デザインファイルが配置されているか | info |
| F5 | `.stories.tsx` ストーリーファイルが配置されているか | warning |

## 出力形式

以下の形式で監査結果を報告する:

```
## 監査結果: {コンポーネント名}

### Critical（修正必須）

- **[T1]** `button.recipe.ts:12` — ハードコード値 `#3b82f6` を使用。`bg.fill.brand` に置き換える
- **[X4]** `button.recipe.ts:8` — `outline: "none"` でフォーカスリングを非表示にしている

### Warning（推奨）

- **[P3]** `button.tsx:15` — インラインの `css({})` をレシピのバリアントに移動すべき

### Info（参考）

- **[X6]** `button.tsx:22` — `disabled` を `aria-disabled` に変更を検討

### 合格項目

- [A1] Ark UI ベース ✓
- [P1] cva() 使用 ✓
- ...
```

## 修正の実施

- critical の項目がある場合、修正方法を提案し AskUserQuestion で修正するか確認する
- 承認を得てから修正を実施する
- 修正後、再度検証を実行する:

```bash
npx panda codegen
npx tsc --noEmit
```
