---
name: token-drift-audit
description: トークン定義と実使用の乖離（ドリフト）を検出する
---

トークン定義と実際の使用状況の乖離（ドリフト）を監査してください。

## 監査の流れ

### 1. Panda CSS MCP でデータ収集

Panda CSS MCP サーバー（`@pandacss/mcp`）が利用可能な場合、以下のツールでトークン情報と使用状況を効率的に収集する:

| MCP ツール | 用途 | 対応チェック |
|-----------|------|------------|
| `get_usage_report` | 未使用トークン・レシピの検出 | D1, D2 |
| `get_tokens` | プリミティブトークン一覧の取得 | D4, D6 |
| `get_semantic_tokens` | セマンティックトークン一覧の取得 | D4, D5 |
| `get_config` | 解決済み設定の確認 | D3, D6 |

MCP が利用できない場合は「1b. ファイルからの手動収集」にフォールバックする。

### 1b. ファイルからの手動収集（MCP 未接続時のフォールバック）

以下のファイルをすべて読み、定義されているトークンを一覧化する:

**プリミティブトークン:**

- `src/preset/theme/tokens/colors.ts`
- `src/preset/theme/tokens/spacing.ts`
- `src/preset/theme/tokens/sizes.ts`
- `src/preset/theme/tokens/radii.ts`
- `src/preset/theme/tokens/fonts.ts`
- `src/preset/theme/tokens/font-sizes.ts`
- `src/preset/theme/tokens/font-weights.ts`
- `src/preset/theme/tokens/line-heights.ts`
- `src/preset/theme/tokens/shadows.ts`
- `src/preset/theme/tokens/borders.ts`
- `src/preset/theme/tokens/z-index.ts`

**セマンティックトークン:**

- `src/preset/theme/semantic-tokens/colors.ts`
- その他カテゴリのセマンティックトークンファイル（存在する場合）

**登録先:**

- `src/preset/theme/tokens/index.ts`
- `src/preset/theme/semantic-tokens/index.ts`
- `panda.config.ts`

### 2. 使用箇所の収集

MCP の `get_usage_report` で取得できない詳細は、以下のファイルを検索して補完する:

- `src/components/**/*.recipe.ts` — レシピでのトークン使用
- `src/components/**/*.tsx` — コンポーネントでのインラインスタイル
- `.storybook/**/*.{ts,tsx}` — Storybook でのトークン使用

### 3. チェック項目

#### D1: 未使用セマンティックトークン（critical）

`src/preset/theme/semantic-tokens/` で定義されているが、どのレシピ・コンポーネントからも参照されていないセマンティックトークン。

**検出方法:** セマンティックトークンのキーパス（例: `primary.DEFAULT`）を生成し、`src/components/` と `.storybook/` 内で文字列検索する。

**注意:** `DEFAULT` キーはパスに含めない（`bg.fill.brand.DEFAULT` → `bg.fill.brand`）。

#### D2: 未使用プリミティブトークン（warning）

`colors.ts` / `spacing.ts` 等で定義されているが、どのセマンティックトークンからも `{colors.xxx}` / `{spacing.xxx}` の形式で参照されていないプリミティブトークン。

**検出方法:** プリミティブトークンのキーパス（例: `colors.blue.600`）を生成し、`src/preset/theme/semantic-tokens/` と `panda.config.ts` 内で `{colors.blue.600}` の形式を検索する。

**除外:** Panda CSS の utility が暗黙的に使用するスケール（`spacing`, `sizes`, `radii`, `fontSizes`, `fontWeights`, `lineHeights` 等）は、レシピから直接数値キーで参照されるため未使用と判定しない。色の中間スケール（50〜950 の全段階）もパレットの一貫性のために保持してよい。

#### D3: インライン定義のセマンティックトークン（warning）

`panda.config.ts` の `semanticTokens` に直接記述されているが、専用ファイル（`src/preset/theme/semantic-tokens/*.ts`）に切り出されていないトークン。

**検出方法:** `panda.config.ts` の `semanticTokens` ブロック内で、`src/preset/theme/semantic-tokens/` からインポートした変数ではなくオブジェクトリテラルで直接定義されているエントリを検出する。

#### D4: 参照先が存在しないセマンティックトークン（critical）

セマンティックトークンの `value` が参照している `{colors.xxx}` や `{spacing.xxx}` が、対応するプリミティブ定義に存在しない。

**検出方法:** セマンティックトークンの value 内の `{...}` 参照を抽出し、プリミティブトークンのキーパスと照合する。

#### D5: ダークモード定義漏れ（warning）

セマンティックカラートークンで `_dark` が未定義のもの。

**検出方法:** `src/preset/theme/semantic-tokens/colors.ts` の各トークンの `value` が `{ base, _dark }` 形式になっているか確認する。`white` / `black` 等のリテラル値で `base` と `_dark` が同値の場合は許容する。

#### D6: エクスポート/登録の不整合（critical）

- `src/preset/theme/tokens/*.ts` でエクスポートしているが `src/preset/theme/tokens/index.ts` に含まれていない
- `src/preset/theme/semantic-tokens/*.ts` でエクスポートしているが `src/preset/theme/semantic-tokens/index.ts` に含まれていない
- 各 `index.ts` でエクスポートしているが `panda.config.ts` に登録されていない
- `panda.config.ts` でインポートしているが対応する `index.ts` に含まれていない

#### D7: コンポーネントでのプリミティブトークン直接使用（critical）

レシピやコンポーネントでプリミティブトークンを直接使用している箇所。セマンティックトークン経由で使用すべき。

**検出方法:** `src/components/**/*.recipe.ts` と `src/components/**/*.tsx` 内で、プリミティブカラートークン（例: `gray.600`, `blue.500`）やハードコード値（`#xxx`, `rgb()`）を検索する。spacing の数値キー（`"2"`, `"4"` 等）は Panda CSS の utility が直接使用するため除外する。

## 出力形式

```
## トークンドリフト監査結果

### 概要

| チェック | 件数 | 深刻度 |
|---------|------|--------|
| D1: 未使用セマンティックトークン | N件 | critical |
| D2: 未使用プリミティブトークン | N件 | warning |
| D3: インライン定義 | N件 | warning |
| D4: 参照先不在 | N件 | critical |
| D5: ダークモード漏れ | N件 | warning |
| D6: エクスポート不整合 | N件 | critical |
| D7: プリミティブ直接使用 | N件 | critical |

### Critical

- **[D1]** `src/preset/theme/semantic-tokens/colors.ts` — `icon.success` はどのコンポーネントからも参照されていない
- **[D4]** `src/preset/theme/semantic-tokens/colors.ts:28` — `{colors.purple.600}` を参照しているが `colors.ts` に `purple` は未定義
- ...

### Warning

- **[D3]** `panda.config.ts:52` — `fontSizes.body` がインラインで定義。`src/preset/theme/semantic-tokens/` への切り出しを推奨
- **[D5]** `src/preset/theme/semantic-tokens/colors.ts:76` — `text.onFill` の `base` と `_dark` が同値（意図的か確認）
- ...

### 合格項目

- [D6] エクスポート/登録の整合性 ✓
- ...
```

## 修正の実施

- critical の項目がある場合、修正方法を提案し AskUserQuestion で修正するか確認する
- 承認を得てから修正を実施する
- 修正後、以下を実行して検証する:

```bash
npx panda codegen
npx tsc --noEmit
```
