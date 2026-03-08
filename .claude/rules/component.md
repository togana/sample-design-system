# コンポーネント実装ルール

## Props 型定義

- Props 型は `type` で明示的に定義する（`interface` は使わない）
- `ComponentProps<typeof Styled...>` からの `Omit` / 継承はしない — 全 props を自前で列挙する

## disabled の実装方式

- ネイティブの `disabled` 属性を使用する（ADR-014）
- disabled の理由はツールチップではなく、常に可視のヘルプテキストで伝える
- Ark UI 使用時: Field.Root / Ark コンポーネントの `disabled` prop をそのまま使う。`data-disabled` はコンテキスト経由で各パーツに自動伝播される

## loading の実装方式

- `isLoading` 時はネイティブ `disabled` + `aria-busy="true"` を付与する

## Ark UI の使い方

- ネイティブ HTML 要素で十分なコンポーネント（Button 等）は Ark UI を使わない
- 複雑な状態管理が必要なコンポーネント（Checkbox 等）は Ark UI を使う
- Ark UI 使用時は Field コンポーネントを外殻として配置する（公式推奨パターン）
  - `aria-describedby` の自動連携: Field.HelperText が自動で紐付け
  - disabled は Field.Root の `disabled` prop で伝播する（ADR-014）

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
