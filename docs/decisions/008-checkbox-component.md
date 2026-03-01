# ADR-008: Checkbox コンポーネントの追加

- ステータス: 承認済み
- 日付: 2026-03-01

## コンテキスト

フォームを含む画面で「複数の選択肢から1つ以上を選択する」UI が必要になっている。現状、各チームが独自にチェックボックスを実装しており、見た目・a11y 対応・indeterminate の扱いにばらつきがある。

Button（ADR-007）に続く2つ目のコンポーネントとして、Checkbox を追加する。

技術スタック: Ark UI Checkbox（headless）+ Panda CSS `cva`（ADR-006）。

### 参照元

- [Serendie CheckBox 仕様](https://serendie.design/components/check-box/)
- Ark UI Checkbox（`@ark-ui/react` にインストール済み）

## 決定

Checkbox をデザインシステムに追加する。Serendie の CheckBox 仕様をベースとし、Ark UI の Checkbox コンポーネントをヘッドレス基盤として利用する。

### API

```tsx
<Checkbox label="利用規約に同意する" />

<Checkbox label="通知設定" helperText="メールで通知を受け取ります" />

<Checkbox label="すべて選択" checked="indeterminate" />
```

#### Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `label` | `string` | - | チェックボックスのラベル（必須） |
| `helperText` | `string` | - | ラベル下部の補足テキスト |
| `checked` | `boolean \| "indeterminate"` | - | 制御された選択状態 |
| `defaultChecked` | `boolean \| "indeterminate"` | `false` | 非制御時の初期状態 |
| `onCheckedChange` | `(details: { checked: CheckedState }) => void` | - | 選択状態変更時のコールバック |
| `disabled` | `boolean` | `false` | 非活性状態 |
| `required` | `boolean` | `false` | 必須フィールド |
| `invalid` | `boolean` | `false` | バリデーションエラー状態 |
| `name` | `string` | - | フォーム送信時のフィールド名 |
| `value` | `string` | `"on"` | フォーム送信時の値 |

`checked` / `defaultChecked` / `onCheckedChange` / `disabled` / `required` / `name` / `value` は Ark UI Checkbox にそのまま渡す。`label` / `helperText` / `invalid` はラッパー側で処理する。

### Ark UI を採用する理由

Button（ADR-007）はネイティブ `<button>` を直接使用したが、Checkbox は以下の点で Ark UI の恩恵が大きい:

| 観点 | ネイティブ実装 | Ark UI |
|------|---------------|--------|
| indeterminate 管理 | DOM API で直接操作が必要（`ref.indeterminate = true`）、React の宣言的モデルと相性が悪い | `checked="indeterminate"` で宣言的に制御 |
| hidden input の管理 | 手動でフォーム連携用の hidden input を管理 | `Checkbox.HiddenInput` が自動管理 |
| data 属性の付与 | 各状態（`data-state`, `data-disabled` 等）を手動で管理 | 自動的に付与される |
| フォーカス管理 | 手動実装 | `data-focus` / `data-focus-visible` を自動管理 |

### コンポーネント構成

Ark UI の Checkbox パーツを内部で組み合わせ、単一のコンポーネントとして公開する:

```tsx
// 内部構成イメージ
<Checkbox.Root>              {/* <label> 要素 */}
  <Checkbox.Control>         {/* チェックボックスの視覚部分 */}
    <Checkbox.Indicator>     {/* チェックマーク / indeterminate マーク */}
      {/* checked → CheckIcon, indeterminate → MinusIcon */}
    </Checkbox.Indicator>
  </Checkbox.Control>
  <LabelArea>
    <Checkbox.Label>         {/* ラベルテキスト */}
      {label}
    </Checkbox.Label>
    {helperText && <HelperText>{helperText}</HelperText>}
  </LabelArea>
  <Checkbox.HiddenInput />   {/* フォーム連携用の hidden input */}
</Checkbox.Root>
```

### バリアント

Serendie の CheckBox はバリアント（`styleType` 相当）を持たない。視覚的なバリエーションは状態（checked / unchecked / indeterminate / disabled）のみで表現する。

### 状態

| 状態 | data 属性（Ark UI 自動付与） | 視覚表現 |
|------|---------------------------|---------|
| unchecked | `data-state="unchecked"` | 空の枠線のみ |
| checked | `data-state="checked"` | `primary` 背景 + チェックマーク |
| indeterminate | `data-state="indeterminate"` | `primary` 背景 + マイナスマーク |
| disabled + unchecked | `data-state="unchecked" data-disabled` | `disabled` 背景 + 薄い枠線 |
| disabled + checked | `data-state="checked" data-disabled` | `disabled` 背景 + 薄いチェックマーク |
| hover | `data-hover` | ホバーオーバーレイ |
| focus-visible | `data-focus-visible` | フォーカスリング |
| invalid | `data-invalid`（Ark UI 非提供、手動付与） | `negative` 色のボーダー |

### スタイル定義

#### Control（チェックボックスの四角い部分）

| 状態 | 背景 | ボーダー | アイコン色 |
|------|------|---------|-----------|
| unchecked | transparent | `borderWidths.thick` solid `outline` | - |
| checked | `primary` | none | `primary.on` |
| indeterminate | `primary` | none | `primary.on` |
| hover (unchecked) | `hovered.variant` | `borderWidths.thick` solid `outline` | - |
| hover (checked) | `primary` + `hovered` オーバーレイ | none | `primary.on` |
| disabled (unchecked) | `disabled` | none | - |
| disabled (checked) | `disabled` | none | `disabled.onSurface` |
| invalid (unchecked) | transparent | `borderWidths.thick` solid `negative` | - |
| focus-visible | 既存状態 + フォーカスリング | `focusVisibleRing: outside` | - |

#### Control のサイズ

| プロパティ | 値 | トークン |
|-----------|-----|---------|
| width / height | 20px | `sizes.7`（20px） |
| border-radius | 4px | `radii.small` |
| border-width | 2px | `borderWidths.thick` |

#### Label

| プロパティ | 値 |
|-----------|-----|
| テキストスタイル | `body.medium`（14px, regular） |
| 色 | `surface.on` |
| disabled 時の色 | `disabled.onSurface` |

#### HelperText

| プロパティ | 値 |
|-----------|-----|
| テキストスタイル | `body.small`（12px, regular） |
| 色 | `surface.onVariant` |
| disabled 時の色 | `disabled.onSurface` |

#### レイアウト

```
┌─────────────────────────────────────┐
│ [Control]  Label text               │
│            Helper text (optional)   │
└─────────────────────────────────────┘
```

| プロパティ | 値 | トークン |
|-----------|-----|---------|
| Root の gap（Control と Label 領域の間隔） | 8px | `spacing.extraSmall` |
| Label と HelperText の gap | 4px | `spacing.twoExtraSmall` |

### 実装方針

```
Ark UI Checkbox（headless、a11y・状態管理）
  ↓
Panda CSS cva でスタイル定義
  ↓
styled() でラップ or Checkbox パーツに className を適用
  ↓
セマンティックトークン参照（ダークモード自動対応）
```

Ark UI の各パーツ（`Root`, `Control`, `Indicator`, `Label`, `HiddenInput`）に対して Panda CSS でスタイルを適用する。`cva` で Control のスタイルバリエーション（状態ごと）を定義し、data 属性セレクタで切り替える。

#### スタイリング方法

Ark UI のパーツに Panda CSS のスタイルを適用する方法は2つある:

1. **`styled()` でラップ**: `styled(Checkbox.Control, controlRecipe)` のように Ark UI パーツを直接 styled ファクトリでラップする
2. **className 適用**: `cva` で生成したクラス名を各パーツの `className` に渡す

Button（ADR-007）と同様に `styled()` ラップ方式を採用する。Ark UI パーツが data 属性を自動付与するため、Panda CSS の conditions（`_checked`, `_disabled` 等）でそのまま状態別スタイルを記述できる。

### ファイル構成

```
src/components/checkbox/
  checkbox.tsx          # コンポーネント本体
  checkbox.recipe.ts    # Panda CSS cva 定義（control, label 等のスタイル）
  checkbox.stories.tsx  # Storybook インタラクションテスト
  checkbox.docs.tsx     # ドキュメント（後日）
  index.ts              # re-export
```

### 必要なトークンの確認

#### 既存トークンで対応可能

| 用途 | トークン | 値 |
|------|---------|-----|
| checked 背景 | `primary` | blue.700 / blue.300 |
| checked アイコン色 | `primary.on` | white / black |
| unchecked ボーダー | `outline` | gray.300 / gray.700 |
| disabled 背景 | `disabled` | gray.100 / gray.900 |
| disabled テキスト | `disabled.onSurface` | gray.400 / gray.600 |
| hover オーバーレイ | `hovered` | bl20 / wh20 |
| hover 背景（subtle） | `hovered.variant` | bl5 / wh5 |
| ラベル色 | `surface.on` | black / gray.200 |
| invalid ボーダー | `negative` | red.600 / red.300 |
| border-radius | `radii.small` | 4px |
| border-width | `borderWidths.thick` | 2px |
| control size | `sizes.7` | 20px |
| gap（root） | `spacing.extraSmall` | 8px |
| gap（label area） | `spacing.twoExtraSmall` | 4px |
| フォーカスリング | `focusVisibleRing` | 既存ユーティリティ |

#### 追加が必要なトークン

| 用途 | 提案するトークン | 値 |
|------|-----------------|-----|
| helperText 色 | `surface.onVariant` | ライト: `gray.500` / ダーク: `gray.400` |

`surface.onVariant` は今後他のコンポーネント（Input, Select 等）でも補助テキスト色として使うため、セマンティックトークンとして追加する価値がある。ただし、既存の `surface.on` で代替可能な場合はトークン追加を見送る。

### MVP 対象外（後日検討）

- CheckboxGroup（複数チェックボックスのグループ管理）
- フォームフィールド統合（FormControl / FormField コンポーネントとの連携）
- アニメーション（チェック時のトランジション）
- サイズバリアント（現時点では単一サイズ）

### a11y

Ark UI が以下を自動で担保する:

- `<label>` 要素によるラベル関連付け（Root が `<label>` をレンダリング）
- hidden `<input type="checkbox">` によるフォームアクセシビリティ
- `aria-checked="mixed"` による indeterminate 状態のスクリーンリーダー通知
- `data-disabled` による disabled 状態の伝達
- キーボード操作（Space キーでトグル）

追加で対応が必要な点:

- `required` 時に視覚的インジケーター（アスタリスク等）は MVP では対応しない。`required` prop は hidden input に伝播させ、ブラウザネイティブのバリデーションに委ねる
- `invalid` 状態は Ark UI に直接 `invalid` prop として渡せる（`data-invalid` が自動付与される）

### リスク

| リスク | 深刻度 | 緩和策 |
|--------|--------|--------|
| Ark UI の Checkbox API が変更される | 低 | Ark UI パーツを内部で使い、外部 API は独自に定義しているため、内部の差し替えで対応可能 |
| `surface.onVariant` トークンの追加判断 | 低 | Serendie のトークン体系に `surface.onVariant` がない場合は `surface.on` で代替し、将来の調整に委ねる |
| styled() と Ark UI パーツの型互換性 | 中 | Ark UI パーツは標準の HTML 要素を拡張しているため `styled()` でのラップは可能だが、型推論で問題が出た場合は className 方式にフォールバックする |
| CheckboxGroup との将来的な統合 | 低 | 単体の Checkbox API を CheckboxGroup 非依存で設計し、後から Group でラップできる構造にする |

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| ベース | Ark UI Checkbox | indeterminate 管理、hidden input、data 属性の自動付与など、自前実装のコストが高い部分をカバーできる。Button とは異なり headless の恩恵が大きい |
| API 設計 | `label` / `helperText` を props で受ける | Serendie の仕様に準拠。Ark UI のパーツ分割（`Checkbox.Label` 等）は内部実装に留め、利用者にはシンプルな props API を提供する |
| バリアント | なし（状態のみ） | Serendie の CheckBox にバリアント概念がないため |
| サイズ | 単一サイズ（20px） | Serendie の仕様に準拠。サイズバリアントの需要が出てきた場合は別途 ADR で追加 |
| invalid 対応 | MVP に含める | フォームでの利用が主用途であり、バリデーションエラー表示は初期から必要 |
| スタイリング | `styled()` ラップ方式 | Button と同じパターンを踏襲し、コードベースの一貫性を保つ |
| disabled 方式 | Ark UI に委任 | Ark UI が `data-disabled` と hidden input の `disabled` を自動管理するため、Button のような `aria-disabled` の手動管理が不要 |
