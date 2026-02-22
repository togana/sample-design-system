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
| プリミティブ | 生の値（色相×スケール等） | `src/tokens/colors.ts`, `spacing.ts`, `sizes.ts`, `radii.ts`, `typography.ts`, `shadows.ts`, `motion.ts` |
| セマンティック | 用途ベースの名前 | `src/tokens/semantic-colors.ts`, `semantic-spacing.ts` |

### セマンティックトークンの命名式

```
{カテゴリ}.{要素/用途}.{ロール}.{状態}
```

- 最大深度: 4階層まで
- ロールと状態は任意

#### 要素/用途の語彙（colors）

- `bg` — 背景色
- `bg.subtle` — 控えめな背景
- `bg.surface` — カード・パネル背景
- `bg.fill` — ボタン等の塗り
- `text` — テキスト色
- `border` — ボーダー色
- `icon` — アイコン色

#### ロールの語彙

`primary`, `secondary`, `brand`, `success`, `warning`, `danger`, `disabled`, `onFill`

#### 状態の語彙

`hover`, `active`, `focus`, `disabled`

### 禁止パターン（必ずチェック）

以下に該当する名前は **絶対に使わない**:

- モード名を含む → `darkBg`, `lightText`
- 特定コンポーネント名を含む → `bg.cardHeader`, `text.sidebar`
- 生の値を含む → `bg.#f5f5f5`
- プリミティブ参照を含む → `bg.gray600`
- 5階層以上 → `bg.surface.hover.active.focus`

### プリミティブトークンのルール

- カラーは11段階スケール: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`
- 新しい色相を追加する場合は `src/tokens/colors.ts` に11段階すべてを定義する

### ダークモードのルール

セマンティックトークンの value は `base`（ライト）と `_dark` の両方を指定する:

```ts
{
  value: { base: "{colors.blue.600}", _dark: "{colors.blue.400}" }
}
```

## 作業手順

### 1. 現状の確認

対象のトークンファイルを読み、既存のトークン一覧を把握する。

### 2. 命名の決定

- 上記の命名式・語彙に従ってトークン名を決める
- 禁止パターンに該当しないことを確認する
- 既存トークンと命名の一貫性を保つ

### 3. 実装

- プリミティブの追加が必要なら `src/tokens/` の該当ファイルを編集する
- セマンティックトークンは `src/tokens/semantic-*.ts` を編集する
- 新しいエクスポートを追加した場合は `src/tokens/index.ts` と `panda.config.ts` も更新する

### 4. 検証

必ず以下を実行して成功を確認する:

```bash
npx panda codegen
npx tsc --noEmit
```

### 5. 報告

追加・変更したトークンを一覧で報告し、AskUserQuestion でコミットするか確認する。
