# ADR-008: Checkbox コンポーネントの追加

- ステータス: 承認済み
- 日付: 2026-03-01
- 改訂: 2026-03-01（Field ベースの設計に変更）

## コンテキスト

フォームを含む画面で「複数の選択肢から1つ以上を選択する」UI が必要になっている。現状、各チームが独自にチェックボックスを実装しており、見た目・a11y 対応・indeterminate の扱いにばらつきがある。

Button（ADR-007）に続く2つ目のコンポーネントとして、Checkbox を追加する。

技術スタック: Ark UI Field + Checkbox（headless）+ Panda CSS `cva`（ADR-006）。

### 参照元

- [Serendie CheckBox 仕様](https://serendie.design/components/check-box/)
- [Ark UI Field – Checkbox 統合](https://ark-ui.com/docs/components/field#checkbox)
- Ark UI Checkbox / Field（`@ark-ui/react` にインストール済み）

## 決定

Checkbox をデザインシステムに追加する。Ark UI の **Field コンポーネントを外殻**とし、その中に Checkbox コンポーネントを配置するパターンで実装する。これは Ark UI が公式に推奨する統合パターンであり、フォーム状態の伝播・ヘルパーテキストのアクセシビリティを Field が自動管理する。

### API

```tsx
<Checkbox label="利用規約に同意する" />

<Checkbox
  label="通知設定"
  helperText="メールで通知を受け取ります"
/>

<Checkbox label="すべて選択" checked="indeterminate" />

<Checkbox label="無効な項目" disabled />
```

#### Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `label` | `string` | - | チェックボックスのラベル（必須） |
| `helperText` | `string` | - | 補足テキスト |
| `checked` | `boolean \| "indeterminate"` | - | 制御された選択状態 |
| `defaultChecked` | `boolean \| "indeterminate"` | `false` | 非制御時の初期状態 |
| `onCheckedChange` | `(details: { checked: CheckedState }) => void` | - | 選択状態変更時のコールバック |
| `disabled` | `boolean` | `false` | 非活性状態 |
| `name` | `string` | - | フォーム送信時のフィールド名 |
| `value` | `string` | `"on"` | フォーム送信時の値 |

`checked` / `defaultChecked` / `onCheckedChange` / `name` / `value` は Ark UI Checkbox.Root にそのまま渡す。`disabled` は Field.Root に渡し、Field が Checkbox.Root へコンテキスト経由で伝播する。`label` / `helperText` はラッパー側で処理する。

`required` / `invalid` は単体の Checkbox には設けない。これらは CheckboxGroup で Field を通じてグループ単位で管理する（後日実装）。ただし、CheckboxGroup から invalid 状態が伝播した際に正しく表示できるよう、Control の invalid スタイル（`_invalid` 条件）はレシピに定義しておく。

### Ark UI を採用する理由

Button（ADR-007）はネイティブ `<button>` を直接使用したが、Checkbox は以下の点で Ark UI の恩恵が大きい:

| 観点 | ネイティブ実装 | Ark UI |
|------|---------------|--------|
| indeterminate 管理 | DOM API で直接操作が必要（`ref.indeterminate = true`）、React の宣言的モデルと相性が悪い | `checked="indeterminate"` で宣言的に制御 |
| hidden input の管理 | 手動でフォーム連携用の hidden input を管理 | `Checkbox.HiddenInput` が自動管理 |
| data 属性の付与 | 各状態（`data-state`, `data-disabled` 等）を手動で管理 | 自動的に付与される |
| フォーカス管理 | 手動実装 | `data-focus` / `data-focus-visible` を自動管理 |

### Field ベースの設計を採用する理由

Checkbox を Field で包む設計を採用する理由:

| 観点 | Checkbox 単体 | Field + Checkbox |
|------|--------------|-----------------|
| disabled の伝播 | props を手動で各パーツに渡す必要がある | Field.Root から Checkbox.Root へコンテキスト経由で自動伝播 |
| HelperText | 自前の `<span>` で実装、a11y は手動管理 | Field.HelperText が `aria-describedby` を自動連携 |
| 将来のフォーム統合 | FormField コンポーネントとの統合を別途設計する必要がある | Field が既にフォームフィールドとして機能しているため追加設計不要 |
| CheckboxGroup への拡張 | Field との統合を後から追加する必要がある | 単体の時点で Field パターンが確立されているため、Group 化時に invalid / required / invalidMessage を自然に追加できる基盤となる |

### コンポーネント構成

Ark UI の Field と Checkbox パーツを内部で組み合わせ、単一のコンポーネントとして公開する:

```tsx
// 内部構成イメージ
<Field.Root>                    {/* フォームフィールドのコンテナ */}
  <Checkbox.Root>               {/* チェックボックス本体 */}
    <Checkbox.Control>          {/* チェックボックスの視覚部分 */}
      <Checkbox.Indicator>      {/* チェックマーク */}
      <Checkbox.Indicator indeterminate>  {/* indeterminate マーク */}
    </Checkbox.Control>
    <Checkbox.Label>            {/* ラベルテキスト */}
      {label}
    </Checkbox.Label>
    <Checkbox.HiddenInput />    {/* フォーム連携用の hidden input */}
  </Checkbox.Root>
  {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
</Field.Root>
```

### バリアント

Serendie の CheckBox はバリアント（`styleType` 相当）を持たない。視覚的なバリエーションは状態（checked / unchecked / indeterminate / disabled）のみで表現する。

### 状態

| 状態 | data 属性（自動付与） | 視覚表現 |
|------|---------------------|---------|
| unchecked | `data-state="unchecked"` | 空の枠線のみ |
| checked | `data-state="checked"` | `primary` 背景 + チェックマーク |
| indeterminate | `data-state="indeterminate"` | `primary` 背景 + マイナスマーク |
| disabled + unchecked | `data-state="unchecked" data-disabled` | `disabled` 背景 + 薄い枠線 |
| disabled + checked | `data-state="checked" data-disabled` | `disabled` 背景 + 薄いチェックマーク |
| hover | `data-hover` | ホバーオーバーレイ |
| focus-visible | `data-focus-visible` | フォーカスリング |
| invalid | `data-invalid`（CheckboxGroup から伝播） | `negative` 色のボーダー |

※ invalid は単体 Checkbox の props としては提供しないが、CheckboxGroup から `data-invalid` が伝播した際に正しく描画するため、スタイル定義には含める。

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

#### HelperText（Field.HelperText）

| プロパティ | 値 |
|-----------|-----|
| テキストスタイル | `body.small`（12px, regular） |
| 色 | `surface.onVariant` |
| disabled 時の色 | `disabled.onSurface` |

#### レイアウト

```
┌──────────────────────────────────────────┐  ← Field.Root
│ ┌──────────────────────────────────────┐ │
│ │ [Control]  Label text                │ │  ← Checkbox.Root（横並び）
│ └──────────────────────────────────────┘ │
│            Helper text (optional)        │  ← Field.HelperText
└──────────────────────────────────────────┘
```

| プロパティ | 値 | トークン |
|-----------|-----|---------|
| Checkbox.Root の gap（Control と Label の間隔） | 8px | `spacing.extraSmall` |
| Field.Root の gap（Checkbox.Root と HelperText の間隔） | 4px | `spacing.twoExtraSmall` |
| HelperText の左マージン | 28px | Control 幅 20px + gap 8px に揃える |

### 実装方針

```
Ark UI Field + Checkbox（headless、a11y・状態管理）
  ↓
Panda CSS cva でスタイル定義
  ↓
styled() でラップ
  ↓
セマンティックトークン参照（ダークモード自動対応）
```

Ark UI の各パーツ（Field.Root, Checkbox.Root, Control, Indicator, Label, HiddenInput, Field.HelperText）に対して Panda CSS でスタイルを適用する。

#### スタイリング方法

Button（ADR-007）と同様に `styled()` ラップ方式を採用する。Ark UI パーツが data 属性を自動付与するため、Panda CSS の conditions（`_checked`, `_disabled` 等）でそのまま状態別スタイルを記述できる。

### ファイル構成

```
src/components/checkbox/
  checkbox.tsx          # コンポーネント本体
  checkbox.recipe.ts    # Panda CSS cva 定義（field, control, label 等のスタイル）
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
| gap（checkbox root） | `spacing.extraSmall` | 8px |
| gap（field root） | `spacing.twoExtraSmall` | 4px |
| フォーカスリング | `focusVisibleRing` | 既存ユーティリティ |

#### 追加が必要なトークン

| 用途 | 提案するトークン | 値 |
|------|-----------------|-----|
| helperText 色 | `surface.onVariant` | ライト: `gray.500` / ダーク: `gray.400` |

`surface.onVariant` は今後他のコンポーネント（Input, Select 等）でも補助テキスト色として使うため、セマンティックトークンとして追加する価値がある。ただし、既存の `surface.on` で代替可能な場合はトークン追加を見送る。

### MVP 対象外（後日検討）

- CheckboxGroup（複数チェックボックスのグループ管理、`invalidMessage` によるバリデーション、`required` 対応を含む）
- アニメーション（チェック時のトランジション）
- サイズバリアント（現時点では単一サイズ）

### a11y

#### Ark UI + Field が自動で担保する項目

- `<label>` 要素によるラベル関連付け（Checkbox.Root + Checkbox.Label）
- hidden `<input type="checkbox">` によるフォームアクセシビリティ
- `aria-checked="mixed"` による indeterminate 状態のスクリーンリーダー通知
- `data-disabled` による disabled 状態の伝達
- キーボード操作（Space キーでトグル）
- **`aria-describedby` の自動連携**: Field.HelperText が hidden input に自動で紐付けられ、スクリーンリーダーが補足情報を読み上げる
- **`disabled` の自動伝播**: Field.Root からコンテキスト経由で伝播

### リスク

| リスク | 深刻度 | 緩和策 |
|--------|--------|--------|
| Ark UI の Checkbox / Field API が変更される | 低 | Ark UI パーツを内部で使い、外部 API は独自に定義しているため、内部の差し替えで対応可能 |
| `surface.onVariant` トークンの追加判断 | 低 | Serendie のトークン体系に `surface.onVariant` がない場合は `surface.on` で代替し、将来の調整に委ねる |
| styled() と Ark UI パーツの型互換性 | 中 | Ark UI パーツは標準の HTML 要素を拡張しているため `styled()` でのラップは可能だが、型推論で問題が出た場合は className 方式にフォールバックする |

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| ベース | Ark UI Field + Checkbox | Field がフォーム状態の伝播・a11y を自動管理し、Checkbox が indeterminate・hidden input・data 属性を担う。Ark UI の公式推奨パターンに従う |
| API 設計 | `label` / `helperText` を props で受ける | Serendie の仕様をベースに、利用者にはシンプルな props API を提供する。バリデーション（`invalidMessage` / `required`）は CheckboxGroup で対応する |
| Field ベース | Field.Root で Checkbox.Root を包む | Ark UI の公式推奨統合パターン。disabled の伝播、aria-describedby の自動連携を活用できる。CheckboxGroup 化時に invalid / required / invalidMessage を自然に追加できる基盤となる |
| invalid スタイル | レシピに定義しておく（props は設けない） | 単体 Checkbox にエラー状態は発生しないが、CheckboxGroup から伝播された際に正しく描画する必要がある |
| バリアント | なし（状態のみ） | Serendie の CheckBox にバリアント概念がないため |
| サイズ | 単一サイズ（20px） | Serendie の仕様に準拠。サイズバリアントの需要が出てきた場合は別途 ADR で追加 |
| スタイリング | `styled()` ラップ方式 | Button と同じパターンを踏襲し、コードベースの一貫性を保つ |
