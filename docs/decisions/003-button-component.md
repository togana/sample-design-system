# ADR-003: Button コンポーネントの追加

- ステータス: 承認済み
- 日付: 2026-02-22

## コンテキスト

全プロダクトチームから共通の Button コンポーネントのリクエストがある。現状、各チームが独自に `<button>` 要素を実装しており、以下の問題が発生している:

- チーム間でスタイル・振る舞いが一貫していない
- a11y 対応の品質にばらつきがある
- デザイン変更時に全チームが個別に修正する必要がある

技術スタックとして Ark UI（headless）+ Panda CSS（スタイリング）を使用する（ADR-002）。

## 決定

Button をデザインシステムの最初のコンポーネントとして追加する。

### 再利用可能性の評価: 高

| 観点 | 評価 |
|------|------|
| 利用頻度 | ほぼすべてのページで使用される |
| 利用チーム数 | 全プロダクトチーム |
| 代替コストの削減 | 各チームの独自実装を統一し、メンテナンスコストを大幅に削減 |
| 構成要素としての価値 | Dialog, Popover, Menu 等の他コンポーネントの土台になる |

### MVP スコープ

#### バリアント

| プロパティ | 値 | 説明 |
|-----------|-----|------|
| `variant` | `solid`, `outline`, `ghost` | 視覚的な強調度の3段階 |
| `size` | `sm`, `md`, `lg` | コンポーネントサイズ |
| `colorScheme` | `brand`, `danger` | 意味的な色分け |

#### 状態

- `hover`, `active`, `focus-visible`: インタラクション状態
- `disabled`: 操作不可状態（`aria-disabled` を使用）
- `loading`: 非同期処理中（スピナー表示、操作不可）

#### アイコン対応

- `leftIcon`, `rightIcon` props でアイコン配置をサポート
- icon-only ボタンは `aria-label` を必須とする

#### 対象外（MVP 後に検討）

- `link` variant（ボタンスタイルのリンク）
- `iconButton` としての独立コンポーネント化
- `asChild` による polymorphic レンダリング
- アニメーション / トランジション（motion トークンとの統合）
- ボタングループ / ツールバー

### 実装方針

```
ネイティブ <button> 要素
  ↓
Panda CSS recipe (cva でバリアント定義)
  ↓
セマンティックトークン参照 (bg.fill.brand, text.onFill, etc.)
```

- Panda CSS の `cva`（Class Variance Authority）で recipe を定義する
- セマンティックトークンを直接参照し、ダークモード・マルチブランドに自動対応する
- Ark UI v5.32.0 に Button / Pressable コンポーネントが存在しないため、ネイティブ `<button>` 要素をベースに a11y を自前で担保する
- `aria-disabled` / `aria-busy` を使用し、disabled / loading 状態のアクセシビリティを確保する

### 必要なトークンの確認

#### 既存トークンで対応可能

| 用途 | トークン |
|------|---------|
| solid 背景 | `bg.fill.brand`, `bg.fill.danger` |
| solid hover | `bg.fill.brand.hover`, `bg.fill.danger.hover` |
| solid テキスト | `text.onFill` |
| outline ボーダー | `border`, `border.focus` |
| テキスト色 | `text.brand`, `text.danger` |
| disabled テキスト | `text.disabled` |
| フォーカスリング | `border.focus` |

#### 追加が必要なトークン

| 用途 | 提案するトークン | 値 |
|------|-----------------|-----|
| ghost hover 背景 | `bg.subtle.hover` | `gray.100` / `gray.800` |
| disabled 背景 | `bg.fill.disabled` | `gray.200` / `gray.800` |
| outline hover 背景 | `bg.surface.hover` | 既存で対応可能 |

### リスクと緩和策

| リスク | 深刻度 | 緩和策 |
|--------|--------|--------|
| バリアント爆発 | 中 | MVP を3 variant × 3 size × 2 colorScheme に制限。追加は ADR で判断 |
| API の固定化 | 中 | 最初のコンポーネントのため API 設計が前例になる。Ark UI の API に沿うことで業界標準に合わせる |
| a11y の複雑性 | 低 | Ark UI が ARIA パターンを管理。icon-only 時の `aria-label` 必須をlint で強制 |
| トークン不足 | 低 | 不足分は少数。Button 追加前にトークンを先行追加する |

## ビルド前に検証すべきこと

1. **既存実装の監査**: 各チームの button 実装を収集し、共通パターンと特殊要件を洗い出す
2. **Ark UI API の確認**: `loading` 状態、icon スロット、polymorphic（`asChild`）の対応状況を確認する
3. **Panda CSS recipe の検証**: `cva` でセマンティックトークンを参照する recipe のプロトタイプを作成し、ダークモード切替を検証する
4. **トークン追加**: `bg.subtle.hover`, `bg.fill.disabled` 等の不足トークンを先行追加する

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| 追加判断 | 追加する | 再利用可能性が高く、全チームが恩恵を受ける。独自実装の統一による品質向上効果が大きい |
| ベース | Ark UI | headless で a11y が担保され、Panda CSS との組み合わせが公式に推奨されている |
| バリアント数 | 3 variant | solid/outline/ghost は業界標準。link は `<a>` との責務分離のため MVP 後に検討 |
| サイズ数 | 3 size | sm/md/lg で大半のユースケースをカバー。xs/xl は実績を見て追加 |
| colorScheme | 2種 | brand（主要アクション）と danger（破壊的操作）が最低限必要。success/warning はユースケースが限定的 |
