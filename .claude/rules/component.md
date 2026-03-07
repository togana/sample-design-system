# コンポーネント実装ルール

## Props 型定義

- Props 型は `type` で明示的に定義する（`interface` は使わない）
- `ComponentProps<typeof Styled...>` からの `Omit` / 継承はしない — 全 props を自前で列挙する

## disabled の実装方式

- ネイティブの `disabled` 属性ではなく `aria-disabled="true"` を使用する
- `aria-disabled` はフォーカス可能な状態を維持しつつ、支援技術に非活性であることを伝達する
- `onClick` ハンドラ内で `aria-disabled` を検査し、`true` の場合は `preventDefault` + early return する
- `data-disabled` 属性も連動して付与する（conditions の `_disabled` が参照するため）
- hover / active の conditions は `not([data-disabled])` でガードされている

## loading の実装方式

- `isLoading` 時は `aria-disabled="true"` + `aria-busy="true"` を付与する
- disabled と同様にクリックイベントを無効化する

## Ark UI の使い方

- ネイティブ HTML 要素で十分なコンポーネント（Button 等）は Ark UI を使わない
- 複雑な状態管理が必要なコンポーネント（Checkbox 等）は Ark UI を使う
- Ark UI 使用時は Field コンポーネントを外殻として配置する（公式推奨パターン）
  - disabled の伝播: Field.Root → コンテキスト経由で子に自動伝播
  - `aria-describedby` の自動連携: Field.HelperText が自動で紐付け

## スタイリング方式

- Ark UI パーツには `styled()` でラップしてスタイルを適用する
- ホバー表現は `::after` 疑似要素によるオーバーレイ方式を採用し、セマンティックトークン `hovered` / `hovered.variant` の半透明色を重ねる

## 排他型 props

- 排他的な props（例: `leftIcon` と `rightIcon`）は TypeScript の排他型（discriminated union）で同時指定を型レベルで防止する

## ファイル構成

```
src/components/{name}/
  {name}.tsx            # コンポーネント本体
  {name}.recipe.ts      # Panda CSS cva/sva 定義（Ark UI 使用時）
  {name}.stories.tsx    # Storybook インタラクションテスト
  {name}.vrt.stories.tsx # VRT 専用ストーリー
  {name}.docs.tsx       # ドキュメント
  index.ts              # re-export
```
