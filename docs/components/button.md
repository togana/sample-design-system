# Button

## 概要

ユーザーのアクションを受け付けるための汎用ボタンコンポーネント。フォーム送信、ダイアログの操作、機能の実行など、クリックによるインタラクションに使用する。

## いつ使うか

- フォームの送信やキャンセルなど、明確なアクションを実行するとき
- ダイアログやモーダルの確認・取消操作
- ページ内の機能トリガー（保存、削除、エクスポートなど）

## いつ使わないか

- 別のページへの遷移には `<a>` タグやリンクコンポーネントを使う
- テキスト中のインラインリンクには使わない
- メニューやトグルなど、専用の UI コンポーネントがある場合はそちらを使う

## Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| variant | `"solid" \| "outline" \| "ghost"` | `"solid"` | ボタンの見た目のバリエーション |
| size | `"sm" \| "md" \| "lg"` | `"md"` | ボタンのサイズ |
| colorScheme | `"brand" \| "danger"` | `"brand"` | カラースキーム |
| loading | `boolean` | `false` | ローディング状態。`true` のときスピナーを表示し操作を無効化する |
| disabled | `boolean` | `false` | 無効化状態 |
| leftIcon | `ReactNode` | - | ボタンテキストの左側に表示するアイコン |
| rightIcon | `ReactNode` | - | ボタンテキストの右側に表示するアイコン |
| type | `"button" \| "submit" \| "reset"` | `"button"` | HTML の `type` 属性 |

上記に加え、`<button>` 要素の標準属性（`onClick`, `aria-label`, `className` など）をすべてサポートする。

## バリアント

### variant

#### solid（デフォルト）

塗りつぶしスタイル。最も視覚的に強調されるバリアント。ページ内の主要なアクション（CTA）に使用する。

#### outline

枠線のみのスタイル。`solid` より控えめな強調度で、副次的なアクション（キャンセル、戻るなど）に使用する。

#### ghost

背景・枠線なしのスタイル。最も控えめで、ツールバーのアクションやインライン操作など、周囲のコンテンツに溶け込ませたい場合に使用する。

### size

#### sm

コンパクトなサイズ（高さ 32px）。テーブル行内のアクションやツールバーなど、スペースが限られた場所で使用する。

#### md（デフォルト）

標準サイズ（高さ 40px）。一般的なフォームやダイアログ内のアクションに使用する。

#### lg

大きめのサイズ（高さ 48px）。ページの主要なCTAや、タッチ操作が多いモバイル向けUIに使用する。

## コード例

### 基本

```tsx
import { Button } from "@/components/button";

<Button>保存</Button>
```

### バリアント一覧

```tsx
// variant
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// size
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// colorScheme
<Button colorScheme="brand">ブランド</Button>
<Button colorScheme="danger">削除</Button>
```

### アイコン付き

```tsx
<Button leftIcon={<PlusIcon />}>追加</Button>
<Button rightIcon={<ArrowRightIcon />}>次へ</Button>
<Button leftIcon={<CloseIcon />} aria-label="閉じる" />
```

### ローディング

```tsx
<Button loading>保存中...</Button>
```

### 無効化

```tsx
<Button disabled>送信</Button>
```

## Do / Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| 1つの画面で `solid` は主要アクション1つに絞る | 主要アクションを複数の `solid` ボタンで並べない |
| ボタンのラベルは「保存」「削除」など具体的な動詞にする | 「こちら」「クリック」など曖昧なラベルにしない |
| icon-only ボタンには `aria-label` を必ず付ける | icon-only ボタンで `aria-label` を省略しない |
| 破壊的操作には `colorScheme="danger"` を使う | 通常の操作に `danger` カラーを使わない |
| `loading` 中はユーザーに処理中であることを伝える | `loading` 中にボタンを非表示にしない |
| `type="button"` をデフォルトとして意図的に `submit` を指定する | フォーム外のボタンに `type="submit"` を使わない |

## アクセシビリティ

### キーボード操作

- `Enter` / `Space` キーでボタンをクリックできる（ネイティブ `<button>` の標準動作）
- `Tab` キーでフォーカスを移動できる

### ARIA 属性

- 無効化時は `aria-disabled="true"` が設定される（`disabled` 属性ではなくイベントハンドラで制御）
- ローディング時は `aria-busy="true"` が設定され、スクリーンリーダーに処理中であることを通知する
- icon-only ボタン（`children` なし）では `aria-label` を必ず指定すること
- アイコン要素には `aria-hidden="true"` が設定され、スクリーンリーダーから隠される
- スピナーにも `aria-hidden="true"` が設定される

### フォーカス管理

- `:focus-visible` でフォーカスリングを表示（`2px solid` のアウトライン、`2px` のオフセット）
- マウスクリック時にはフォーカスリングを表示しない（`:focus-visible` により制御）
