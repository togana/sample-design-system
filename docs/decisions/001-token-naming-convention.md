# ADR-001: トークン命名規約

- ステータス: 承認済み
- 日付: 2026-02-22
- 最終更新: 2026-02-23

## コンテキスト

Panda CSS でデザインシステムのトークンを定義するにあたり、命名規約を統一する必要がある。以下の要件がある:

- Panda CSS の semantic tokens 機能を使う
- プリミティブ → セマンティック の2層構造
- ダークモード対応（Panda の conditions を使う）

事前に Shopify Polaris / Chakra UI v3 / Park UI のトークン設計を調査し、比較検討を行った（[調査結果](../research/token-structure-comparison.md)）。カラートークンの値とロール体系は Serendie Design System を参考にしている。

## 決定

### トークン階層: 2層構造

| 層 | 役割 | 命名パターン | 例 |
|---|---|---|---|
| プリミティブ | 生の値 | `{色相}.{スケール番号}` | `gray.100`, `blue.600` |
| セマンティック | 用途ベース | `{ロール}.{バリエーション}` | `primary.DEFAULT`, `surface.on` |

### プリミティブトークン

- 10段階スケール: `100, 200, 300, 400, 500, 600, 700, 800, 900, 1000`
- 初期色相: `gray`, `blue`, `red`, `green`, `yellow`
- 値は Serendie Design System のカラーパレットから流用する

### セマンティックカラーのロール体系

Serendie Design System に倣い、ロールを **Impression / Component / Interaction** の3区分で整理する。

#### Impression（印象）

ブランドやUIの印象を形作るロール。各ロールに4つのバリエーションを持つ。

| ロール | 用途 | 参照プリミティブ |
|--------|------|------------------|
| `primary` | ブランド認識・主要アクション | blue 系 |
| `secondary` | 補助的な役割 | gray 系 |
| `tertiary` | 第三の補助色 | 未定 |
| `positive` | 成功・完了 | green 系 |
| `negative` | エラー・失敗 | red 系 |
| `notice` | 警告・注意喚起 | yellow 系 |

**バリエーション（ドット区切りネスト）:**

```ts
colors: {
  primary: {
    DEFAULT: { value: { base: "...", _dark: "..." } },  // ロール色そのもの（ボタン塗り等）
    on:      { value: { base: "...", _dark: "..." } },  // ロール色上の前景色
    container:   { value: { base: "...", _dark: "..." } },  // 大面積背景（バッジ・チップ等）
    onContainer: { value: { base: "...", _dark: "..." } },  // 大面積背景上の前景色
  },
}
```

#### Component（構成）

UI要素の形成に用いるロール。

| ロール | 用途 | バリエーション |
|--------|------|---------------|
| `surface` | デフォルトの背景色 | `DEFAULT`, `on` |
| `outline` | ボーダー色 | `DEFAULT`, `bright`, `dim` |

#### Interaction（インタラクション）

状態変化を表現するロール。半透明色による状態レイヤー方式。

| ロール | 用途 |
|--------|------|
| `hovered` | ホバー状態 |
| `selected` | 選択状態 |
| `disabled` | 非活性状態 |

### セマンティックトークンの命名式

```
{カテゴリ}.{ロール}.{バリエーション}
```

- カラー以外のカテゴリは従来どおり用途ベースで命名する
- 最大深度: 4階層まで

#### カラー以外の用途語彙

| 要素 | カテゴリ | 説明 |
|---|---|---|
| `component` | spacing | コンポーネント内余白 |
| `section` | spacing | セクション間余白 |
| `page` | spacing | ページレベル余白 |

### 禁止パターン

- モード名を含めない（`darkBg`, `lightText`）
- 特定コンポーネント名を含めない（`primary.buttonHeader`）
- 生の値を含めない（`primary.#3B86F9`）
- プリミティブ参照を含めない（`primary.blue600`）
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
| color | `colors.{色相}.{スケール}` | `colors.{ロール}.{バリエーション}` |
| spacing | `spacing.{数値}` | `spacing.{用途}.{サイズ}` |
| typography | `fontSizes.{サイズ}`, `fontWeights.{名前}`, `lineHeights.{名前}` | `fontSizes.{用途}` |
| radii | `radii.{サイズ}` | `radii.{用途}` |
| elevation | `shadows.{サイズ}` | `shadows.{用途}` |
| borders | `borderWidths.{サイズ}` | `borderWidths.{用途}` |
| zIndex | `zIndex.{名前}` | ― |

### アクセシビリティ基準

カラーコントラストは **APCA (Advanced Perceptual Contrast Algorithm)** を基準とする。

- テキストに使用するカラートークンは **Lc 75以上**（スケール600番以上相当）を使用する
- 大きなテキスト（18px bold / 24px 以上）は Lc 60以上を許容する
- 装飾的な要素には基準を適用しない

## 根拠

| 判断 | 選択 | 理由 |
|---|---|---|
| 階層数 | 2層 | シンプルで理解しやすい。Park UI の3層（コンポーネントバリアント層）は必要に応じて後から追加可能 |
| スケール | 10段階 (100-1000) | Serendie Design System と同じ値を流用するため、スケール番号も揃える |
| 色相 | 5色 (gray, blue, red, green, yellow) | セマンティックロールで必要な最小限。必要に応じて Serendie の残り5色（SkyBlue, Purple, Pink, Chestnut, Beige）を追加可能 |
| ロール体系 | Impression / Component / Interaction の3区分 | Serendie Design System に準拠。ロールの分類意図が明確になる |
| 命名構造 | ドット区切りネスト | Panda CSS のセマンティックトークンのネスト機能を活かす。`primary.on` のように直感的に参照できる |
| on/Container パターン | 採用 | 前景色と背景色の対応関係が命名から明確になる。アクセシビリティの担保が容易 |
| アクセシビリティ | APCA (Lc 75+) | Serendie Design System と同じ基準。人間の知覚に基づく評価で WCAG 2.x の比率ベースより正確 |
| ダークモード | `_dark` 条件 + スケール反転 | Panda CSS ネイティブ。値の完全なコントロールが可能 |
