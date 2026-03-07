# ADR-011: RadioButton コンポーネントの追加

- ステータス: 提案
- 日付: 2026-03-08

## コンテキスト

フォームを含む画面で「複数の選択肢から1つを排他的に選択する」UI が必要になっている。Checkbox（ADR-008）が複数選択を担うのに対し、RadioButton は単一選択を担う。

Checkbox に続くフォーム系コンポーネントとして、RadioButton を追加する。

技術スタック: Ark UI RadioGroup（headless）+ Panda CSS `sva`（ADR-006）。

### 参照元

- [Serendie RadioButton 仕様](https://serendie.design/components/radio-button/)
- [Ark UI RadioGroup](https://ark-ui.com/react/docs/components/radio-group)
- Ark UI RadioGroup（`@ark-ui/react` にインストール済み）

## 決定

RadioButton をデザインシステムに追加する。Checkbox（ADR-008）と異なり、RadioButton は **RadioGroup（グループ）と RadioButtonItem（個別項目）の2層構造** で設計する。これはラジオボタンが本質的にグループ内での排他選択であり、単体では意味を持たないためである。

### API

```tsx
<RadioGroup label="通知方法" name="notification">
  <RadioButtonItem label="メール" value="email" />
  <RadioButtonItem label="SMS" value="sms" />
  <RadioButtonItem label="プッシュ通知" value="push" />
</RadioGroup>

<RadioGroup
  label="配送方法"
  name="delivery"
  defaultValue="standard"
  helperText="お届け日の目安は選択後に表示されます"
>
  <RadioButtonItem label="通常配送" value="standard" helperText="3〜5営業日" />
  <RadioButtonItem label="速達" value="express" helperText="1〜2営業日" />
</RadioGroup>

<RadioGroup label="無効なグループ" disabled>
  <RadioButtonItem label="選択肢A" value="a" />
  <RadioButtonItem label="選択肢B" value="b" />
</RadioGroup>
```

#### RadioGroup Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `label` | `string` | - | グループのラベル（必須） |
| `helperText` | `string` | - | グループの補足テキスト |
| `value` | `string` | - | 制御された選択値 |
| `defaultValue` | `string` | - | 非制御時の初期選択値 |
| `onValueChange` | `(details: { value: string }) => void` | - | 選択変更時のコールバック |
| `disabled` | `boolean` | `false` | グループ全体の非活性状態 |
| `name` | `string` | - | フォーム送信時のフィールド名 |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 項目の配置方向 |
| `children` | `ReactNode` | - | RadioButtonItem を配置 |

#### RadioButtonItem Props

| Prop | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| `label` | `string` | - | 選択肢のラベル（必須） |
| `value` | `string` | - | 選択肢の値（必須） |
| `helperText` | `string` | - | 選択肢の補足テキスト |
| `disabled` | `boolean` | `false` | 個別項目の非活性状態 |

### Checkbox との設計差異

| 観点 | Checkbox（ADR-008） | RadioButton |
|------|---------------------|-------------|
| 選択モデル | 単体で完結（複数選択は CheckboxGroup で後日対応） | グループ内の排他選択が前提 |
| コンポーネント構成 | `<Checkbox />` 単体 | `<RadioGroup>` + `<RadioButtonItem>` の2層 |
| Field の配置 | 個々の Checkbox を Field で包む | RadioGroup 全体を Field で包む |
| indeterminate | あり | なし（排他選択のため不要） |
| Ark UI パーツ | Field + Checkbox | RadioGroup（Field は使用しない — 後述） |

### Ark UI を採用する理由

Checkbox と同様に、ラジオボタンは Ark UI の恩恵が大きい:

| 観点 | ネイティブ実装 | Ark UI RadioGroup |
|------|---------------|-------------------|
| グループ内の排他制御 | `name` 属性による暗黙的な紐付け + 手動の状態管理 | RadioGroup.Root が自動管理 |
| hidden input の管理 | 各ラジオボタンに手動で配置 | RadioGroup.ItemHiddenInput が自動管理 |
| data 属性の付与 | `data-state`, `data-disabled` 等を手動管理 | 自動的に付与される |
| キーボード操作 | 矢印キーでのフォーカス移動を手動実装 | Ark UI が WAI-ARIA Radio Group パターンに準拠して自動管理 |
| フォーカス管理 | `data-focus` / `data-focus-visible` を手動管理 | 自動管理 |

### Field を使用しない理由

Checkbox（ADR-008）では Field.Root で Checkbox.Root を包んだが、RadioButton では Field を使用しない。

Ark UI の RadioGroup は自身が `RadioGroup.Label` を持ち、グループラベルを `role="radiogroup"` + `aria-labelledby` で管理する。Field.Root を外殻にすると、Field の `<label>` と RadioGroup の `aria-labelledby` が競合し、スクリーンリーダーがラベルを二重読み上げするリスクがある。

RadioGroup が自前で担う機能:
- グループラベル（`RadioGroup.Label` → `aria-labelledby`）
- 排他選択の状態管理
- キーボードナビゲーション（矢印キー）
- `data-disabled` の伝播

helperText は RadioGroup.Root 直下に独自の要素として配置し、`aria-describedby` を手動で紐付ける。

### コンポーネント構成

```tsx
// 内部構成イメージ
<RadioGroup.Root>                     {/* グループのコンテナ（role="radiogroup"） */}
  <RadioGroup.Label>                  {/* グループラベル */}
    {label}
  </RadioGroup.Label>
  {helperText && <HelperText />}      {/* グループの補足テキスト */}

  {/* children として RadioButtonItem を配置 */}
  <RadioGroup.Item value="...">       {/* 個別のラジオボタン */}
    <RadioGroup.ItemControl />        {/* ラジオボタンの円形部分 */}
    <RadioGroup.ItemText>             {/* 選択肢のラベル */}
      {label}
    </RadioGroup.ItemText>
    <RadioGroup.ItemHiddenInput />    {/* フォーム連携用の hidden input */}
  </RadioGroup.Item>
  {itemHelperText && <ItemHelperText />}  {/* 選択肢の補足テキスト */}
</RadioGroup.Root>
```

### バリアント

Serendie の RadioButton は以下の形式を持つ:

| 形式 | 説明 |
|------|------|
| Single Line | ラベルのみ表示 |
| Multiple Line | ラベル + 補足テキスト |

形式の切り替えは `helperText` props の有無で自動的に決まるため、明示的なバリアント prop は設けない。

### 状態

| 状態 | data 属性（自動付与） | 視覚表現 |
|------|---------------------|---------|
| unchecked | `data-state="unchecked"` | 空の円形枠線 |
| checked | `data-state="checked"` | `primary` 背景の内円 |
| disabled + unchecked | `data-state="unchecked" data-disabled` | `disabled` 色の枠線 |
| disabled + checked | `data-state="checked" data-disabled` | `disabled` 色の内円 |
| hover | `data-hover` | ホバーオーバーレイ |
| focus-visible | `data-focus-visible` | フォーカスリング |

### スタイル定義

#### ItemControl（ラジオボタンの円形部分）

| 状態 | 背景 | ボーダー | 内円 |
|------|------|---------|------|
| unchecked | transparent | `borderWidths.thick` solid `outline` | なし |
| checked | transparent | `borderWidths.thick` solid `primary` | `primary` |
| hover (unchecked) | `hovered.variant` | `borderWidths.thick` solid `outline` | なし |
| hover (checked) | `hovered.variant` | `borderWidths.thick` solid `primary` | `primary` |
| disabled (unchecked) | `disabled` | none | なし |
| disabled (checked) | `disabled` | none | `disabled.onSurface` 内円 |
| focus-visible | 既存状態 + フォーカスリング | `focusVisibleRing: outside` | - |

#### ItemControl のサイズ

| プロパティ | 値 | トークン |
|-----------|-----|---------|
| width / height | 20px | `sizes.7`（20px） |
| border-radius | 50% | `radii.full` |
| border-width | 2px | `borderWidths.thick` |
| 内円のサイズ | 10px | 外径の半分（`::before` 疑似要素で実装） |

#### Label（ItemText）

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

#### GroupLabel

| プロパティ | 値 |
|-----------|-----|
| テキストスタイル | `body.medium`（14px, regular） |
| 色 | `surface.on` |
| disabled 時の色 | `disabled.onSurface` |

#### レイアウト

```
┌──────────────────────────────────────────┐  ← RadioGroup.Root
│  Group Label                             │  ← RadioGroup.Label
│  Group Helper text (optional)            │  ← HelperText
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ (○)  Label text                    │  │  ← RadioGroup.Item
│  │       Item helper text (optional)  │  │  ← ItemHelperText
│  ├────────────────────────────────────┤  │
│  │ (○)  Label text                    │  │
│  │       Item helper text (optional)  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

| プロパティ | 値 | トークン |
|-----------|-----|---------|
| Item 内の gap（Control と Label の間隔） | 8px | `spacing.extraSmall` |
| Item 間の gap | 8px | `spacing.extraSmall` |
| GroupLabel と項目群の gap | 4px | `spacing.twoExtraSmall` |
| ItemHelperText の左マージン | 28px | Control 幅 20px + gap 8px に揃える |

### 実装方針

```
Ark UI RadioGroup（headless、a11y・状態管理・キーボードナビゲーション）
  ↓
Panda CSS sva でスロット付きスタイル定義
  ↓
createStyleContext でスタイル適用
  ↓
セマンティックトークン参照（ダークモード自動対応）
```

Ark UI の各パーツ（RadioGroup.Root, Label, Item, ItemControl, ItemText, ItemHiddenInput）に対して Panda CSS でスタイルを適用する。

#### スタイリング方法

Checkbox（ADR-008）と同様に `createStyleContext` + `sva` 方式を採用する。スロットは `root`, `label`, `item`, `itemControl`, `itemText`, `helperText`, `itemHelperText` の7つ。

### ファイル構成

```
src/components/radio-button/
  radio-button.tsx          # RadioGroup + RadioButtonItem コンポーネント本体
  radio-button.recipe.ts    # Panda CSS sva 定義
  radio-button.stories.tsx  # Storybook インタラクションテスト
  radio-button.vrt.stories.tsx # VRT 専用ストーリー
  radio-button.docs.tsx     # ドキュメント（後日）
  index.ts                  # re-export
```

### 必要なトークンの確認

#### 既存トークンで対応可能

| 用途 | トークン | 値 |
|------|---------|-----|
| checked ボーダー・内円 | `primary` | blue.700 / blue.300 |
| unchecked ボーダー | `outline` | gray.300 / gray.700 |
| disabled 背景 | `disabled` | gray.100 / gray.900 |
| disabled テキスト・内円 | `disabled.onSurface` | gray.400 / gray.600 |
| hover オーバーレイ | `hovered.variant` | bl5 / wh5 |
| ラベル色 | `surface.on` | black / gray.200 |
| helperText 色 | `surface.onVariant` | Checkbox で追加済み |
| border-radius | `radii.full` | 9999px |
| border-width | `borderWidths.thick` | 2px |
| control size | `sizes.7` | 20px |
| gap（item 内） | `spacing.extraSmall` | 8px |
| gap（label と項目群） | `spacing.twoExtraSmall` | 4px |
| フォーカスリング | `focusVisibleRing` | 既存ユーティリティ |

#### 追加が必要なトークン

なし。Checkbox（ADR-008）で追加した `surface.onVariant` を含め、既存トークンですべて対応可能。

### disabled の実装

Checkbox（ADR-008）とは異なり、Ark UI の `disabled` prop をそのまま使用する。

RadioGroup は `readOnly` 時にフォーカスリングが表示されないため、Checkbox で採用した `readOnly` + 手動 `data-disabled` の回避策は不要である。Ark UI の `disabled` を使うことで `data-disabled` が全パーツに自動伝播され、実装が大幅に簡素化される。

- RadioGroup.Root に `disabled` を渡してグループ全体を非活性にする
- RadioGroup.Item に `disabled` を渡して個別項目を非活性にする
- Ark UI パーツ外の要素（`itemHelperText`）のみ `data-disabled` を手動付与する（`useRadioGroupContext().getItemState()` でグループ disabled を含む状態を取得）

### MVP 対象外（後日検討）

- アニメーション（選択時のトランジション）
- サイズバリアント（現時点では単一サイズ）
- `required` / `invalid` / `invalidMessage`（フォームバリデーション統合）

### a11y

#### Ark UI RadioGroup が自動で担保する項目

- `role="radiogroup"` + `aria-labelledby` によるグループラベルの関連付け
- 各項目の `role="radio"` + `aria-checked` による選択状態のスクリーンリーダー通知
- hidden `<input type="radio">` によるフォームアクセシビリティ
- キーボード操作（矢印キーで項目間移動、Space キーで選択）
- `data-disabled` による disabled 状態の伝達
- `data-focus-visible` によるフォーカス可視化

#### 手動で対応する項目

- グループの helperText に対する `aria-describedby` の紐付け
- Ark UI パーツ外の要素（`itemHelperText`）への `data-disabled` の手動付与

### リスク

| リスク | 深刻度 | 緩和策 |
|--------|--------|--------|
| Ark UI の RadioGroup API が変更される | 低 | Ark UI パーツを内部で使い、外部 API は独自に定義しているため、内部の差し替えで対応可能 |
| Field を使わないことで将来のフォーム統合に影響 | 低 | RadioGroup 自体がフォームフィールドとして機能しており、`name` / hidden input でフォーム送信に対応。バリデーション追加時は RadioGroup 内部で `aria-invalid` / エラーメッセージを管理する |
| グループ disabled と個別 disabled の競合 | 低 | グループ disabled 時は全項目を一律 disabled にし、個別 disabled は独立して動作する。両方指定された場合はグループ disabled が優先される |

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| ベース | Ark UI RadioGroup | 排他選択・キーボードナビゲーション・hidden input・data 属性の自動管理を活用 |
| 構成 | RadioGroup + RadioButtonItem の2層 | ラジオボタンは本質的にグループ内の排他選択。単体では意味を持たないため、グループを前提とした API が自然 |
| Field | 使用しない | RadioGroup.Label が `aria-labelledby` を管理しており、Field.Root の `<label>` と競合するリスクがある。RadioGroup 自体がフォームフィールドとして十分に機能する |
| バリアント | なし（helperText の有無で形式が自動決定） | Serendie の仕様に準拠。明示的なバリアント prop は不要 |
| サイズ | 単一サイズ（20px） | Serendie の仕様に準拠 |
| スタイリング | `createStyleContext` + `sva` 方式 | Checkbox と同じパターンを踏襲。スロット付きコンポーネントに適している |
| disabled 方式 | Ark UI ネイティブ `disabled` | RadioGroup は `readOnly` 時にフォーカスリングが出ないため、Checkbox と異なりネイティブ `disabled` を使用。`data-disabled` の自動伝播により実装が簡素化される |
| orientation デフォルト | `"vertical"` | Serendie の仕様では縦並びが基本。Ark UI のデフォルト（`"horizontal"`）を上書きする |
