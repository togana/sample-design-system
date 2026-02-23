---
name: add-token
description: トークン命名規約に従って、デザイントークンを追加・修正する
argument-hint: <追加したいトークンの説明>
---

$ARGUMENTS の内容に基づいてデザイントークンを追加・修正してください。

## 命名規約（ADR-001 準拠）

### トークン階層: 2層構造

| 層 | 役割 | 配置先 |
|---|---|---|
| プリミティブ | 生の値（色相×スケール等） | `src/preset/theme/tokens/colors.ts`, `spacing.ts`, `sizes.ts`, `radii.ts`, `fonts.ts`, `font-sizes.ts`, `font-weights.ts`, `line-heights.ts`, `shadows.ts`, `borders.ts`, `z-index.ts` |
| セマンティック | 用途ベースの名前 | `src/preset/theme/semantic-tokens/colors.ts` 等（カテゴリごとにファイルを分割） |

### セマンティックカラーのロール体系（3区分）

> 詳細な用途・UI例は `docs/research/color-role-guide.md` を参照。

#### on/Container パターン（前景・背景の分離）

アクセシビリティとダークモード対応のため、前景色と背景色を分離して定義する:

- `DEFAULT` — ロール色そのもの（小面積・高強調: ボタン塗り、アイコン）
- `on` — DEFAULT の上に載せる前景色（ボタンラベル等）
- `container` — 大面積の控えめな背景色（Badge・Alert 背景等）
- `onContainer` — container の上に載せる前景色

#### Impression（印象）

| ロール | 用途 | 参照プリミティブ | バリエーション |
|--------|------|------------------|---------------|
| `primary` | ブランドを象徴、UIの重要度を示す | blue 系 | DEFAULT, on, container, onContainer |
| `secondary` | primary の補助 | blue 系 | DEFAULT, on, container, onContainer |
| `tertiary` | 第三の補助色 | blue 系 | DEFAULT, on, container, onContainer |
| `positive` | 成功・完了・安全 | green 系 | 上記4つ + containerVariant, onContainerVariant |
| `negative` | エラー・失敗・危険 | red 系 | 上記4つ + containerVariant, onContainerVariant |
| `notice` | 警告・注意喚起 | yellow 系 | 上記4つ + containerVariant, onContainerVariant |

#### Component（構成）

| ロール | バリエーション |
|--------|---------------|
| `surface` | `DEFAULT`, `on`, `onVariant`, `dim`, `bright`, `container`, `containerBright`, `containerDim`, `inverse`, `inverseOn`, `inversePrimary` |
| `outline` | `DEFAULT`, `bright`, `dim` |
| `scrim` | （バリエーションなし。半透明オーバーレイ用） |

#### Interaction（インタラクション）

半透明色を状態レイヤーとして要素の上に重ねる方式。

| ロール | バリエーション |
|--------|---------------|
| `hovered` | `DEFAULT`, `variant`, `onPrimary` |
| `selected` | `DEFAULT`, `surface` |
| `disabled` | `DEFAULT`, `onSurface` |

### セマンティックトークンの命名式

```
{カテゴリ}.{ロール}.{バリエーション}
```

- 最大深度: 4階層まで

#### カラー以外の用途語彙

- `component` (spacing) — コンポーネント内余白
- `section` (spacing) — セクション間余白
- `page` (spacing) — ページレベル余白

### 禁止パターン（必ずチェック）

以下に該当する名前は **絶対に使わない**:

- モード名を含む → `darkBg`, `lightText`
- 特定コンポーネント名を含む → `primary.buttonHeader`
- 生の値を含む → `primary.#3B86F9`
- プリミティブ参照を含む → `primary.blue600`
- 5階層以上 → `primary.container.hover.active.focus`

### プリミティブトークンのルール

- カラーは Serendie Design System 準拠の10段階スケール: `100, 200, 300, 400, 500, 600, 700, 800, 900, 1000`
- 初期色相: `gray`, `blue`, `red`, `green`, `yellow`
- 新しい色相を追加する場合は `src/preset/theme/tokens/colors.ts` に10段階すべてを定義する

### ダークモードのルール

セマンティックトークンの value は `base`（ライト）と `_dark` の両方を指定する:

```ts
{
  value: { base: "{colors.blue.600}", _dark: "{colors.blue.400}" }
}
```

### アクセシビリティ基準

- テキスト用カラーは **APCA Lc 75以上**（スケール600番以上相当）を使用する
- 大きなテキスト（18px bold / 24px 以上）は Lc 60以上を許容する
- 装飾的な要素には基準を適用しない

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

## 作業手順

### 1. 現状の確認

対象のトークンファイルを読み、既存のトークン一覧を把握する。

### 2. 命名の決定

- 上記の命名式・語彙に従ってトークン名を決める
- 禁止パターンに該当しないことを確認する
- 既存トークンと命名の一貫性を保つ

### 3. 実装

- プリミティブの追加が必要なら `src/preset/theme/tokens/` の該当ファイルを編集する
- セマンティックトークンは `src/preset/theme/semantic-tokens/` の該当ファイルを編集する
- 新しいエクスポートを追加した場合は各ディレクトリの `index.ts` と `panda.config.ts` も更新する

### 4. 検証

必ず以下を実行して成功を確認する:

```bash
npx panda codegen
npx tsc --noEmit
```

### 5. 報告

追加・変更したトークンを一覧で報告し、AskUserQuestion でコミットするか確認する。
