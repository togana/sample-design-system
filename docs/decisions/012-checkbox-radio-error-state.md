# ADR-012: Checkbox / RadioButton にエラー状態を追加

- ステータス: 提案
- 日付: 2026-03-08

## コンテキスト

Checkbox（ADR-008）と RadioButton（ADR-011）はいずれもフォームバリデーションにおけるエラー状態を MVP 対象外としていた。しかし、実際のフォームでは「1つ以上選択してください」「いずれかを選択してください」といったバリデーションエラーが頻出する。

現状の課題:

- Checkbox のレシピには `_invalid` スタイルが定義済みだが、props として `invalid` を公開していない
- RadioButton のレシピには `_invalid` スタイル自体が未定義
- どちらのコンポーネントもエラーメッセージを表示する手段がない

エラー状態がないと、利用者はコンポーネント外に独自のエラー表示を実装することになり、見た目・a11y 対応にばらつきが生じる。

## 決定

Checkbox と RadioButton の両方に `invalid` と `errorText` props を追加し、エラー状態の表示とアクセシビリティをコンポーネント内で一貫して管理する。

### API

#### Checkbox

```tsx
<Checkbox
  label="利用規約に同意する"
  invalid
  errorText="同意が必要です"
/>
```

#### RadioGroup

```tsx
<RadioGroup
  label="通知方法"
  name="notification"
  invalid
  errorText="いずれかを選択してください"
>
  <RadioButtonItem label="メール" value="email" />
  <RadioButtonItem label="SMS" value="sms" />
</RadioGroup>
```

### Props の追加

#### Checkbox に追加する Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `invalid` | `boolean` | `false` | エラー状態 |
| `errorText` | `string` | - | エラーメッセージ（`invalid` が `true` のときのみ表示） |

#### RadioGroup に追加する Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `invalid` | `boolean` | `false` | エラー状態 |
| `errorText` | `string` | - | エラーメッセージ（`invalid` が `true` のときのみ表示） |

RadioButtonItem にはエラー関連の props を追加しない。エラーはグループ単位で管理する。

### エラー状態の適用単位

| コンポーネント | 適用単位 | 理由 |
|---------------|---------|------|
| Checkbox | 個々の Checkbox | 単体で完結するコンポーネントであり、個別にバリデーションエラーを持つ（例: 「同意が必要です」） |
| RadioGroup | グループ全体 | 排他選択はグループ単位の操作であり、エラーもグループに対して発生する（例: 「いずれかを選択してください」） |

将来 CheckboxGroup を実装する際は、RadioGroup と同様にグループ単位でエラーを管理する。

### 視覚表現

#### Checkbox（invalid 時）

| パーツ | 変化 |
|--------|------|
| Control（unchecked） | ボーダー色が `outline` → `negative` に変化 |
| Control（checked / indeterminate） | 変化なし（`primary` 背景のまま。選択済みの状態は正しいため視覚的にエラーを示す必要がない） |
| ErrorMessage | `negative` 色のテキストを HelperText の位置に表示 |

#### RadioButton（invalid 時）

| パーツ | 変化 |
|--------|------|
| ItemControl（unchecked） | ボーダー色が `outline` → `negative` に変化 |
| ItemControl（checked） | 変化なし（`primary` ボーダー・内円のまま） |
| ErrorMessage | `negative` 色のテキストを ItemGroup の下に表示 |

#### ErrorMessage のスタイル

| プロパティ | 値 |
|-----------|-----|
| テキストスタイル | `body.small`（12px, regular） |
| 色 | `negative` |

ErrorMessage のレイアウト位置は HelperText と同じ。`invalid` かつ `errorText` が指定されている場合、HelperText と ErrorMessage を両方表示する。HelperText は補足情報として常に有用であり、エラー時に隠すと操作の手がかりが失われるため。

### 状態の組み合わせ

| 状態 | 挙動 |
|------|------|
| `invalid` のみ（`errorText` なし） | 視覚的なエラー表示（ボーダー色変化）のみ。メッセージは表示しない |
| `invalid` + `errorText` | 視覚的なエラー表示 + エラーメッセージを表示 |
| `invalid` + `disabled` | `disabled` が優先。エラー表示はしない（操作できない状態でエラーを示すのは不適切） |

### アクセシビリティ

#### aria 属性

| 属性 | 適用先 | 説明 |
|------|--------|------|
| `aria-invalid="true"` | Checkbox: HiddenInput / RadioGroup: Root | エラー状態をスクリーンリーダーに伝達 |
| `aria-errormessage` | Checkbox: HiddenInput / RadioGroup: Root | ErrorMessage 要素の `id` を参照し、エラーメッセージを紐付ける |
| `role="alert"` | ErrorMessage 要素 | エラーメッセージが動的に表示された際にスクリーンリーダーが即座に読み上げる |

#### Checkbox の実装

Checkbox は Field.Root を使用しているため、Field.ErrorText を利用する。Field.ErrorText は `invalid` 時に自動で `aria-errormessage` を HiddenInput に紐付ける。

```tsx
<StyledField invalid={invalid} data-disabled={disabled || undefined}>
  <StyledRoot ...>
    ...
  </StyledRoot>
  {helperText && <StyledHelperText ...>{helperText}</StyledHelperText>}
  {invalid && errorText && (
    <StyledErrorText>{errorText}</StyledErrorText>
  )}
</StyledField>
```

ただし、Field.Root の `invalid` prop が内部で `data-invalid` を Checkbox パーツに自動伝播するかを検証する必要がある。伝播しない場合は `data-invalid` を手動で各パーツに付与する。

#### RadioGroup の実装

RadioGroup は Field を使用していないため、`aria-errormessage` を手動で付与する。`aria-invalid` は Ark UI の `invalid` prop 経由で自動付与される。`data-invalid` も各 ItemControl に自動伝播される。

```tsx
<StyledRoot
  disabled={disabled}
  invalid={isInvalid}
  aria-describedby={helperText ? helperTextId : undefined}
  aria-errormessage={showError ? errorTextId : undefined}
  ...
>
  <StyledLabel>{label}</StyledLabel>
  {helperText && <StyledHelperText id={helperTextId}>{helperText}</StyledHelperText>}
  {showError && (
    <StyledErrorText id={errorTextId} role="alert">
      {errorText}
    </StyledErrorText>
  )}
  <StyledItemGroup ...>{children}</StyledItemGroup>
</StyledRoot>
```

ItemControl への `data-invalid` の伝播は、RadioGroup.Root に `data-invalid` を付与し、レシピの conditions で祖先セレクタを使うか、Context 経由で各 Item に伝播するかを実装時に判断する。

### レシピの変更

#### Checkbox（既存の `_invalid` を活用）

`_invalid` スタイルは control スロットに定義済み（ボーダー色 `negative`）。新たに `errorText` スロットを追加する。

```ts
// checkbox.recipe.ts に追加
slots: ["field", "root", "control", "label", "helperText", "errorText"],
// ...
errorText: {
  textStyle: "body.small",
  color: "negative",
  marginInlineStart: "7",
  paddingInlineStart: "extraSmall",
},
```

#### RadioButton（`_invalid` を新規追加）

`itemControl` に `_invalid` スタイルを追加し、`errorText` スロットを追加する。

```ts
// radio-button.recipe.ts に追加
slots: [...既存, "errorText"],
// itemControl に追加
_invalid: {
  borderColor: "negative",
},
// 新規スロット
errorText: {
  textStyle: "body.small",
  color: "negative",
},
```

### 必要なトークンの確認

すべて既存トークンで対応可能。

| 用途 | トークン |
|------|---------|
| エラーボーダー | `negative` |
| エラーメッセージ色 | `negative` |

### レイアウト

#### Checkbox（invalid 時）

```
+-----------------------------------------+  <- Field.Root
| +-------------------------------------+ |
| | [Control]  Label text               | |  <- Checkbox.Root
| +-------------------------------------+ |
|            Helper text (optional)       |  <- Field.HelperText
|            Error message                |  <- Field.ErrorText (invalid 時のみ)
+-----------------------------------------+
```

#### RadioGroup（invalid 時）

```
+-----------------------------------------+  <- RadioGroup.Root
|  Group Label                            |  <- RadioGroup.Label
|  Group Helper text (optional)           |  <- HelperText
|                                         |
|  +-----------------------------------+  |
|  | (○)  Label text                   |  |  <- RadioGroup.Item
|  |       Item helper text            |  |
|  +-----------------------------------+  |
|  | (○)  Label text                   |  |
|  +-----------------------------------+  |
|                                         |
|  Error message                          |  <- ErrorMessage (invalid 時のみ)
+-----------------------------------------+
```

### MVP 対象外（後日検討）

- `required` prop とネイティブフォームバリデーションの統合
- CheckboxGroup でのグループ単位のエラー管理
- エラーメッセージのアニメーション（フェードイン等）

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| エラー管理の単位 | Checkbox: 個別 / RadioGroup: グループ | Checkbox は単体で完結、RadioButton はグループ内排他選択という性質に基づく |
| `invalid` + `errorText` の分離 | 2つの独立した props | `invalid` のみで視覚的なエラー表示、`errorText` でテキスト表示。バリデーションライブラリとの統合時に柔軟性が高い |
| `disabled` + `invalid` の優先順位 | `disabled` 優先 | 操作不能な状態でエラーを示すのは UX 上不適切。主要なデザインシステム（Material Design 等）も同様の方針 |
| HelperText の扱い | エラー時も非表示にしない | 補足情報は操作の手がかりとして常に有用。エラー時に隠すとユーザーが正しい操作を判断しづらくなる |
| ErrorMessage の `role="alert"` | 採用 | 動的に表示されるエラーメッセージをスクリーンリーダーが即座に読み上げるために必要 |
| Checkbox の `_invalid` 伝播 | Field.Root の `invalid` prop を使用 | Field が `data-invalid` を Checkbox パーツに伝播する仕組みを活用。disabled と異なりフォーカス喪失の問題がないため、Field のネイティブ機能を使える |
