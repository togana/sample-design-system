# ADR-007: Button コンポーネントの追加

- ステータス: 承認済み
- 日付: 2026-02-23
- 廃止: ADR-003

## コンテキスト

全プロダクトチームから共通の Button コンポーネントのリクエストがある。各チームが独自に `<button>` 要素を実装しており、スタイル・振る舞い・a11y 対応にばらつきがある。

以前の ADR-003 で Button の追加を決定したが、バリアント定義や API が Serendie Design System と乖離していたため廃止した。本 ADR は Serendie の Button 仕様に準拠した形で再設計する。

技術スタック: ネイティブ `<button>` + Panda CSS `cva`（ADR-002, ADR-006）。

### 参照元

- [Serendie Button 仕様](https://serendie.design/components/button/)
- [Serendie UI 実装](https://github.com/serendie/serendie)

## 決定

Button をデザインシステムの最初のコンポーネントとして追加する。API・バリアント・サイズ体系は Serendie Design System に準拠する。

### API

```tsx
<Button styleType="filled" size="medium" leftIcon={<Icon />} isLoading>
  ラベル
</Button>
```

#### Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `styleType` | `"filled" \| "outlined" \| "ghost" \| "rectangle"` | `"filled"` | 視覚バリアント |
| `size` | `"small" \| "medium"` | `"medium"` | コンポーネントサイズ |
| `leftIcon` | `ReactElement` | - | 左側アイコン（`rightIcon` と排他） |
| `rightIcon` | `ReactElement` | - | 右側アイコン（`leftIcon` と排他） |
| `isLoading` | `boolean` | `false` | ローディング状態 |
| `disabled` | `boolean` | `false` | 非活性状態（`aria-disabled` で実装） |
| `children` | `ReactNode` | - | ボタンラベル |

`leftIcon` と `rightIcon` は TypeScript の排他型で同時指定を型レベルで防止する。

### 設計方針: 見た目と機能の分離

Button コンポーネントは `<button>` 要素のみを担当する。リンクとしての振る舞い（ページ遷移等）が必要な場合は、別途 Link コンポーネントを設計する。`asChild` による要素の差し替えや `link` バリアントは提供しない。

### バリアント

| styleType | 用途 | 視覚的特徴 |
|-----------|------|-----------|
| `filled` | 最重要アクション（フォーム送信等） | 塗りつぶし背景 |
| `outlined` | 副次アクション | ボーダーのみ、pill 形状 |
| `ghost` | 補助アクション | 背景なし、テキストのみ |
| `rectangle` | 副次アクション（角丸長方形） | `outlined` と同様だが `radius.medium`（8px） |

同一画面内に複数の `filled` を並べることは非推奨とする（Serendie ガイドラインに準拠）。

### サイズ

| size | 高さ | padding-x | padding-y | テキストスタイル | 用途 |
|------|------|-----------|-----------|-----------------|------|
| `medium` | 48px | 24px (`spacing.extraLarge`) | 12px (`spacing.small`) | `label.large`（13px） | 全画面サイズ対応 |
| `small` | 32px | 12px (`spacing.small`) | 4px (`spacing.twoExtraSmall`) | `label.medium`（12px） | PC のみ。タッチデバイス非推奨 |

アイコン付きの場合、アイコン側の padding を縮小する:

| size | アイコン側 px | 反対側 px |
|------|-------------|-----------|
| `medium` | 16px (`spacing.medium`) | 24px (`spacing.extraLarge`) |
| `small` | 8px (`spacing.extraSmall`) | 16px (`spacing.medium`) |

### 状態

| 状態 | 実装方法 |
|------|---------|
| enabled | デフォルト |
| hover | `_hover` 疑似クラス。`::after` オーバーレイまたは `bgColor` でホバー表現。`[aria-disabled=true]` 時は適用しない |
| focus-visible | `_focusVisible` 疑似クラス。アウトラインによるフォーカスリング |
| disabled | `aria-disabled="true"` + `cursor: not-allowed`。クリックイベントを `preventDefault` で無効化 |
| loading | `isLoading` prop。スピナー表示。内部で `aria-disabled="true"` + `aria-busy="true"` を付与 |

#### disabled の実装: `aria-disabled` 方式

ネイティブの `disabled` 属性ではなく `aria-disabled="true"` を使用する。

**理由:**

- ネイティブ `disabled` はフォーカスを受け付けなくなるため、キーボードユーザーやスクリーンリーダーユーザーがボタンの存在を認識できない場合がある
- `aria-disabled` はフォーカス可能な状態を維持しつつ、支援技術に非活性であることを伝達する
- フォーム内の disabled ボタンについて「なぜ押せないのか」のコンテキストを提供しやすい

**実装上の注意:**

- `onClick` ハンドラ内で `aria-disabled` を検査し、`true` の場合は `preventDefault` + early return する
- conditions に `_disabled` が `[data-disabled]` を参照する設定が既にあるため、コンポーネント内で `aria-disabled` に連動して `data-disabled` 属性も付与する
- hover / active の conditions は `not([data-disabled])` で既にガードされている（`src/preset/conditions.ts`）

```tsx
// 実装イメージ
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (props.disabled || props.isLoading) {
    e.preventDefault();
    return;
  }
  props.onClick?.(e);
};

<styled.button
  aria-disabled={props.disabled || props.isLoading || undefined}
  aria-busy={props.isLoading || undefined}
  data-disabled={props.disabled || props.isLoading || undefined}
  onClick={handleClick}
>
```

### スタイル定義

各バリアント × 状態のトークンマッピング:

#### filled

| 状態 | 背景 | テキスト色 |
|------|------|-----------|
| default | `primary` | `primary.on` |
| hover | `primary` + `hovered` オーバーレイ | `primary.on` |
| focus | `primary` + `hovered` オーバーレイ | `primary.on` |
| disabled | `disabled` | `disabled.onSurface` |

#### outlined

| 状態 | 背景 | テキスト色 | ボーダー |
|------|------|-----------|---------|
| default | transparent | `surface.on` | 1px solid `outline` |
| hover | `hovered.variant` | `surface.on` | 1px solid `outline` |
| focus | `hovered.variant` | `surface.on` | 1px solid `outline.dim` |
| disabled | `disabled` | `disabled.onSurface` | none |

#### ghost

| 状態 | 背景 | テキスト色 |
|------|------|-----------|
| default | transparent | `primary` |
| hover | `hovered.variant` | `primary` |
| focus | `hovered.variant` + 1px solid `outline.dim` | `primary` |
| disabled | transparent | `disabled.onSurface` |

#### rectangle

`outlined` と同一のスタイルだが、`borderRadius` が `radii.medium`（8px）。

### 共通ベーススタイル

```
borderRadius: radii.full (9999px)  ※ rectangle のみ radii.medium (8px)
display: inline-flex
gap: spacing.twoExtraSmall (4px)
alignItems: center
justifyContent: center
overflow: hidden
cursor: pointer  ※ disabled 時は not-allowed
position: relative  ※ ::after オーバーレイ用
```

### 実装方針

```
ネイティブ <button> 要素
  ↓
Panda CSS cva でバリアント定義
  ↓
styled("button", buttonRecipe) でコンポーネント化（ADR-006）
  ↓
セマンティックトークン参照（ダークモード自動対応）
```

- Panda CSS の `cva` で recipe を定義し、`styled` ファクトリでラップする
- Ark UI に Button コンポーネントが存在しないため、ネイティブ `<button>` をベースにする
- ホバー表現は `::after` 疑似要素によるオーバーレイ方式を採用し、セマンティックトークン `hovered` / `hovered.variant` の半透明色を重ねる

### ファイル構成

```
src/components/button/
  button.tsx          # コンポーネント本体
  button.stories.tsx  # Storybook ストーリー
  button.docs.tsx     # ドキュメント（後日）
  index.ts            # re-export
```

### 必要なトークンの確認

#### 既存トークンで対応可能

| 用途 | トークン | 値 |
|------|---------|-----|
| filled 背景 | `primary` | blue.700 / blue.300 |
| filled テキスト | `primary.on` | white / black |
| outlined ボーダー | `outline` | gray.300 / gray.700 |
| outlined 強調ボーダー | `outline.dim` | gray.500 / gray.500 |
| テキスト色 | `surface.on` | black / gray.200 |
| ghost テキスト | `primary` | blue.700 / blue.300 |
| disabled 背景 | `disabled` | gray.100 / gray.900 |
| disabled テキスト | `disabled.onSurface` | gray.400 / gray.600 |
| hover オーバーレイ | `hovered` | bl20 / wh20 |
| hover 背景（subtle） | `hovered.variant` | bl5 / wh5 |
| border-radius | `radii.full`, `radii.medium` | 9999px, 8px |
| gap | `spacing.twoExtraSmall` | 4px |

#### 追加が必要なトークン

現時点で不足するトークンはない。既存のセマンティックトークンで全バリアント・全状態をカバーできる。

### MVP 対象外（後日検討）

- icon-only ボタン（`aria-label` 必須の独立コンポーネント）
- ボタングループ / ツールバー
- トランジションアニメーション
- `negative`（danger）カラーバリアント

### a11y

- disabled 状態は `aria-disabled="true"` で実装し、ボタンのフォーカス可能性を維持する
- loading 時は `aria-disabled="true"` + `aria-busy="true"` を設定する
- `_focusVisible` でキーボードフォーカスを視覚的に示す
- hover / active は `data-disabled` でガードし、disabled 時にインタラクション表現を抑制する
- icon-only ボタンは MVP 対象外とし、実装時に `aria-label` 必須を型で強制する

### リスク

| リスク | 深刻度 | 緩和策 |
|--------|--------|--------|
| Serendie との API 差分が生じる | 中 | prop 名・値を Serendie に極力合わせ、移行コストを最小化する |
| `aria-disabled` のイベント透過 | 中 | `onClick` で明示的にガードし、フォームの `submit` イベントも `onSubmit` 側で二重防御する |
| `rectangle` の必要性が低い | 低 | Serendie 準拠のため含める。利用状況を見て判断 |
| ホバーのオーバーレイ方式が複雑 | 低 | `::after` + `position: absolute` で実装。Serendie と同じアプローチのため実績がある |

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| バリアント名 | `styleType` | Serendie と同じ prop 名を採用し、学習コストを下げる |
| バリアント数 | 4種 | Serendie 準拠。`rectangle` は `outlined` の角丸違いで実装コストが低い |
| サイズ数 | 2種（small / medium） | Serendie 準拠。タッチ対応を考慮し medium をデフォルトにする |
| `colorScheme` | 採用しない | Serendie にはカラースキーム概念がない。`negative` バリアントは必要性が確認でき次第、別 ADR で追加 |
| ベース | ネイティブ `<button>` | Ark UI に Button がないため。シンプルなコンポーネントでありヘッドレスライブラリの恩恵が小さい |
| スタイリング | `cva` + `styled` | ADR-006 に準拠。`css()` は使わない |
| disabled 方式 | `aria-disabled` | フォーカス可能性を維持し、支援技術への伝達とユーザビリティを両立する |
| 見た目と機能の分離 | `asChild` / `link` バリアント不採用 | Button は `<button>` 要素の責務のみ担当。リンク機能が必要な場合は Link コンポーネントとして別途設計する |
| ホバー方式 | `::after` オーバーレイ | Serendie と同じ方式。半透明トークン（`hovered`）を重ねることで、元の背景色を問わず統一的にホバー表現できる |
