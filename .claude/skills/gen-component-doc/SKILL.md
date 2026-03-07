---
name: gen-component-doc
description: コンポーネントのソースコードからドキュメントを生成・更新する
argument-hint: <コンポーネント名>
---

$ARGUMENTS で指定されたコンポーネントのソースコードを読み、Storybook Docs ページ用のドキュメントコンポーネントと VRT 専用ストーリーを生成してください。

## 対象ファイルの読み込み

`src/components/{name}/` 配下の以下のファイルをすべて読む:

- `{name}.tsx` — メインコンポーネント（Props、状態管理、アクセシビリティ）
- `{name}.recipe.ts` — Panda CSS レシピ（バリアント、サイズ、デフォルト値）
- `{name}.stories.tsx` — 既存ストーリー（argTypes の確認）
- `index.ts` — エクスポート内容の確認

## 出力先

- `src/components/{name}/{name}.docs.tsx` — Docs ページ
- `src/components/{name}/{name}.vrt.stories.tsx` — VRT 専用ストーリー

既存ファイルがある場合は上書きして更新する。

## 仕組み

- `{name}.docs.tsx` で React コンポーネント（`{Name}DocsPage`）を export する
- `{name}.stories.tsx` の `parameters.docs.page` にそのコンポーネントを指定する
- Storybook の MDX レンダラーを使わず、自前の React コンポーネントで Docs タブを描画する

### stories と docs の役割分担

- **`{name}.stories.tsx`** — `play` 関数付きインタラクションテストのみ（`tags: ["!dev"]` でサイドバー非表示）
- **`{name}.docs.tsx`** — 全バリアント・サイズ・状態のビジュアルショーケース、Do/Don't、アクセシビリティ情報

バリアント・サイズ・状態の描画は docs.tsx に集約する。stories.tsx にビジュアルショーケース用のストーリーは作らない。

### stories への接続

`{name}.stories.tsx` に以下が設定されていることを確認し、なければ追加する:

```tsx
import { {Name}DocsPage } from "./{name}.docs";

const meta = preview.meta({
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: {Name}DocsPage,
    },
  },
  // ...
});
```

## 共通レイアウトコンポーネント

`.storybook/docs-components.tsx` から import して使用する:

```tsx
import {
  DocsContainer,   // ページ全体のラッパー
  DocsTitle,        // h1
  DocsHeading,      // h2
  DocsSubheading,   // h3
  DocsText,         // 本文テキスト
  DocsCaption,      // 補足テキスト（小さめ・セカンダリカラー）
  DocsDivider,      // セクション区切り線
  DocsLabel,        // ラベル（xs サイズ）
  DocsSizeLabel,    // サイズラベル（右寄せ・固定幅）
  DocsRow,          // 横並びレイアウト
  DocsStateRow,     // 状態表示用の横並び（広めの gap）
  DocsVariantGroup, // バリアント縦並びグループ
  DocsList,         // 箇条書きリスト
  DocsTable,        // テーブル
} from "../../../.storybook/docs-components";
```

- コンポーネント固有のヘルパー（`SizeRow` 等）はドキュメントファイル内に定義する
- `<ArgTypes />` は `@storybook/addon-docs/blocks` から import する

## ドキュメント構成

以下のセクション構成に従う。コンポーネントの特性に応じてセクションを追加・省略する:

```
1. タイトル + 概要 + バリアント一覧キャプション
2. いつ使うか / いつ使わないか
3. バリアントごとのビジュアルショーケース
4. 状態（デフォルト、無効、ローディング等）
5. 固有の機能（アイコン、スロット等）
6. Do / Don't
7. アクセシビリティ（キーボード操作、ARIA 属性、フォーカス管理）
8. Props（<ArgTypes /> で自動生成）
```

各セクションは `<DocsDivider />` で区切る。

## セクション記述ルール

### 概要

- コンポーネントの役割と用途を 1-2 文で説明する

### いつ使うか / いつ使わないか

- `<DocsList>` で具体的な使用場面・非使用場面を列挙する

### バリアントショーケース

- 実際のコンポーネントを描画し、視覚的に確認できるようにする
- variant × colorScheme × size などの軸がある場合は組み合わせを網羅する

### Do / Don't

- `<DocsTable>` で Do と Don't を対比する
- ソースコードの実装（アクセシビリティ対応、状態管理など）から導出する
- 最低 4 行は記載する

### アクセシビリティ

- ソースコードで使用している ARIA 属性を正確に記載する
- キーボード操作はネイティブ要素の標準動作も含める
- フォーカスリングのスタイル仕様を記載する

### Props

- `<ArgTypes />` を配置する
- `stories.tsx` の `argTypes` に description と table が設定されていることを確認し、不足があれば追加する

## スタイリングルール

- `styled` ファクトリのみ使用する（`css()` 関数は禁止）
- 共通コンポーネントは `.storybook/docs-components.tsx` から import する
- コンポーネント固有のスタイルが必要な場合はドキュメントファイル内で `styled` を使って定義する

## VRT 専用ストーリー

`{name}.vrt.stories.tsx` を生成する。既存の `.stories.tsx`（インタラクションテスト用）とは meta が異なるため別ファイルにする。

### ルール

- `title: "VRT/{ComponentName}"` — VRT テストのフィルタ対象
- `tags: ["!dev", "!autodocs"]` — Storybook のサイドバー・Docs に非表示
- play 関数なし — props のバリアント別に静的な描画のみ
- レシピのバリアント軸（styleType, size 等）と状態（disabled, loading, checked 等）を網羅する

### テンプレート

```tsx
import preview from "../../../.storybook/preview";
import { MyComponent } from "./my-component";

const meta = preview.meta({
  title: "VRT/MyComponent",
  component: MyComponent,
  tags: ["!dev", "!autodocs"],
  args: {
    // デフォルト args
  },
});

export default meta;

// バリアント軸ごとにストーリーを export する
export const VariantA = meta.story({
  args: { variant: "a" },
});
```

## 作業手順

1. ソースコードを読む
2. 共通レイアウトコンポーネントの最新の export 一覧を確認する
3. `{name}.docs.tsx` を生成する
4. `{name}.vrt.stories.tsx` を生成する
5. `{name}.stories.tsx` に `docs.page` パラメータが設定されていなければ追加する
6. `npx panda codegen && npx tsc --noEmit && npm run build-storybook` で検証する
7. `npm run test:vrt:update` で VRT ベースラインを生成する
8. AskUserQuestion でコミットするか確認する
