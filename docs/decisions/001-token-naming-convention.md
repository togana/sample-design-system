# ADR-001: トークン命名規約

- ステータス: 承認済み
- 日付: 2026-02-22

## コンテキスト

Panda CSS でデザインシステムのトークンを定義するにあたり、命名規約を統一する必要がある。以下の要件がある:

- Panda CSS の semantic tokens 機能を使う
- プリミティブ → セマンティック の2層構造
- ダークモード対応（Panda の conditions を使う）

事前に Shopify Polaris / Chakra UI v3 / Park UI のトークン設計を調査し、比較検討を行った（[調査結果](../research/token-structure-comparison.md)）。

## 決定

### トークン階層: 2層構造

| 層 | 役割 | 命名パターン | 例 |
|---|---|---|---|
| プリミティブ | 生の値 | `{色相}.{スケール番号}` | `gray.50`, `blue.600` |
| セマンティック | 用途ベース | `{要素}.{ロール}.{状態}` | `bg.surface`, `text.danger` |

### プリミティブトークン

- 11段階スケール: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`
- 初期色相: `gray`, `blue`, `red`, `green`, `yellow`, `orange`, `purple`

### セマンティックトークンの命名式

```
{カテゴリ}.{要素/用途}.{ロール}.{状態}
```

- 最大深度: 4階層まで
- ロールと状態は任意

#### 要素/用途の語彙

| 要素 | カテゴリ | 説明 |
|---|---|---|
| `bg` | colors | 背景色 |
| `bg.subtle` | colors | 控えめな背景 |
| `bg.surface` | colors | カード・パネル背景 |
| `bg.fill` | colors | ボタン等の塗り |
| `text` | colors | テキスト色 |
| `border` | colors | ボーダー色 |
| `icon` | colors | アイコン色 |
| `component` | spacing | コンポーネント内余白 |
| `section` | spacing | セクション間余白 |
| `page` | spacing | ページレベル余白 |

#### ロールの語彙

`primary`, `secondary`, `brand`, `success`, `warning`, `danger`, `disabled`, `onFill`

#### 状態の語彙

`hover`, `active`, `focus`, `disabled`

### 禁止パターン

- モード名を含めない（`darkBg`, `lightText`）
- 特定コンポーネント名を含めない（`bg.cardHeader`）
- 生の値を含めない（`bg.#f5f5f5`）
- プリミティブ参照を含めない（`bg.gray600`）
- 5階層以上にしない

### ダークモード

Panda CSS の `conditions` で `_dark` を定義し、セマンティックトークンの `value` 内で `base` / `_dark` を切り替える。

```ts
conditions: {
  light: "[data-color-mode=light] &",
  dark: "[data-color-mode=dark] &",
}
```

### カテゴリ一覧

| カテゴリ | プリミティブ | セマンティック |
|---|---|---|
| color | `colors.{色相}.{スケール}` | `colors.{要素}.{ロール}.{状態}` |
| spacing | `spacing.{数値}` | `spacing.{用途}.{サイズ}` |
| typography | `fontSizes.{サイズ}`, `fontWeights.{名前}`, `lineHeights.{名前}` | `fontSizes.{用途}` |
| elevation | `shadows.{サイズ}` | `shadows.{用途}` |
| motion | `durations.{名前}`, `easings.{名前}` | ― |

## 根拠

| 判断 | 選択 | 理由 |
|---|---|---|
| 階層数 | 2層 | シンプルで理解しやすい。Park UI の3層（コンポーネントバリアント層）は必要に応じて後から追加可能 |
| スケール | 11段階 (50-950) | Tailwind / Chakra UI と同じ。エコシステムとの互換性が高い |
| 命名式 | `{要素}.{ロール}.{状態}` | Polaris の構造的な命名 + Chakra UI の簡潔さのバランス |
| ダークモード | `_dark` 条件 + スケール反転 | Panda CSS ネイティブ。値の完全なコントロールが可能 |
