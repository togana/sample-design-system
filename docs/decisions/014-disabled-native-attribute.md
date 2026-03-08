# ADR-014: disabled 実装をネイティブ disabled 属性に変更

- ステータス: 承認済み
- 日付: 2026-03-08
- 改定: ADR-007（Button）、ADR-008（Checkbox）、ADR-011（RadioButton）の disabled 方針を上書き

## コンテキスト

これまで本プロジェクトでは、disabled 状態のコンポーネントに**ネイティブ `disabled` 属性を使わず、`aria-disabled="true"` でフォーカスを維持する**方針を採用していた（ADR-007, 008）。

この方針の目的は:

- キーボードユーザーが Tab キーで disabled 要素の存在に気づけるようにする
- フォーカス時にツールチップ等で「なぜ無効なのか」を伝えられるようにする

しかし実装上、Ark UI の disabled がネイティブ `disabled` を hidden input に付与する設計と衝突し、以下のワークアラウンドが必要になっていた:

- `readOnly` で操作を無効化（Zag.js の onClick ガードを利用）
- `aria-disabled` + `data-disabled` を各パーツに手動伝播（5〜6箇所）
- Field.Root の `disabled` prop を使わない（自動伝播の利点を放棄）
- コンポーネントごとに disabled の実装パターンが異なる

Ark UI から React Aria への移行で解決するかを調査したが、React Aria も同様にネイティブ `disabled` をデフォルトとしており、フォーカス維持には Hooks API へのフォールバックが必要で本質的な解決にならないことが判明した（詳細: `docs/research/ark-ui-vs-react-aria.md`）。

## 決定

**ネイティブ `disabled` 属性を使用し、disabled の理由は可視テキストで伝える。**

### 方針の変更点

| 項目 | 旧方針 | 新方針 |
|------|--------|--------|
| disabled 属性 | `aria-disabled="true"` | ネイティブ `disabled` |
| フォーカス可能性 | 維持する | 維持しない（ネイティブ動作に従う） |
| 無効理由の伝達 | ツールチップ（フォーカス時） | 常に可視のヘルプテキスト |
| クリック無効化 | `onClick` ハンドラで `preventDefault` + early return | ネイティブ `disabled` が自動で無効化 |
| Ark UI との統合 | `readOnly` + 手動 `data-disabled` 伝播 | `disabled` prop をそのまま使用 |

### Button の変更

```tsx
// Before（aria-disabled 方式）
<StyledButton
  aria-disabled={isDisabled || undefined}
  data-disabled={isDisabled || undefined}
  onClick={handleClick} // ← isDisabled 時に preventDefault + early return
>

// After（ネイティブ disabled 方式）
<StyledButton
  disabled={isDisabled || undefined}
>
```

`handleClick` 内の disabled ガードが不要になる。

### Checkbox の変更

```tsx
// Before（readOnly + 手動 data-disabled 伝播）
<StyledField
  invalid={isInvalid}
  data-disabled={disabled || undefined}
>
  <StyledRoot
    readOnly={disabled || undefined}
    aria-disabled={disabled || undefined}
    data-disabled={disabled || undefined}
  >
    <StyledControl data-disabled={disabled || undefined}>
    <StyledLabel data-disabled={disabled || undefined}>
    <ArkCheckbox.HiddenInput aria-disabled={disabled || undefined} />
  </StyledRoot>
  <StyledHelperText data-disabled={disabled || undefined}>

// After（Field.Root の disabled で自動伝播）
<StyledField
  disabled={disabled || undefined}
  invalid={isInvalid}
>
  <StyledRoot>
    <StyledControl>
    <StyledLabel>
    <ArkCheckbox.HiddenInput />
  </StyledRoot>
  <StyledHelperText>
```

Field.Root の `disabled` がコンテキスト経由で Checkbox.Root に伝播し、`data-disabled` も各パーツに自動付与される。手動伝播が不要になる。

### RadioButton の変更

RadioGroup.Root に `disabled` をそのまま渡す。`readOnly` + `aria-disabled` + 手動 `data-disabled` 伝播が不要になる。

### loading の変更

`isLoading` 時も同様にネイティブ `disabled` を使用する。`aria-busy="true"` は引き続き付与する。

```tsx
<StyledButton
  disabled={isDisabled || undefined}
  aria-busy={isLoading || undefined}
>
```

### conditions の変更

`_hover` / `_active` の conditions で `not([data-disabled])` でガードしていたが、ネイティブ `disabled` では `:hover` / `:active` がブラウザレベルで無効化されるため、ガードは不要になる。ただし Ark UI コンポーネントが `data-disabled` を自動付与するため、既存の conditions 定義はそのまま残しても害はない。

## 根拠

### ネイティブ `disabled` で十分な理由

1. **WCAG に違反しない**: WCAG 2.1 / 2.2 に disabled 要素のフォーカスを規定する成功基準は存在しない
2. **スクリーンリーダーは disabled 要素を認識する**: ブラウズモード（仮想カーソル）で到達・読み上げが可能。NVDA は「利用不可」、VoiceOver は「dimmed」とアナウンスする
3. **業界の多数派**: React Spectrum (Adobe)、Carbon (IBM)、Lightning (Salesforce) がネイティブ `disabled` を採用
4. **無効理由の伝達はツールチップより可視テキストが優れている**: ツールチップはモバイルで hover できない問題があり、常に可視のテキストの方が発見性が高い

### ワークアラウンドの解消

| コンポーネント | 旧: 手動伝播箇所数 | 新: 手動伝播箇所数 |
|---|---|---|
| Button | 3（`aria-disabled`, `data-disabled`, `handleClick` ガード） | 1（`disabled`） |
| Checkbox | 7（`readOnly`, `aria-disabled`, `data-disabled` × 5パーツ） | 1（Field.Root の `disabled`） |
| RadioButton | 6（`readOnly`, `aria-disabled`, `data-disabled` × 4パーツ） | 1（RadioGroup.Root の `disabled`） |

### 今後のコンポーネント追加が容易になる

Ark UI の `disabled` prop をそのまま使えるため、新しいコンポーネントを追加する際にワークアラウンドのパターンを検討する必要がなくなる。

## リスク

| リスク | 深刻度 | 緩和策 |
|--------|--------|--------|
| Tab キーで disabled 要素をスキップするため、キーボードユーザーが存在に気づかない | 低 | ブラウズモードで認識可能。可視テキストで無効理由を常に表示 |
| フォーム送信時に disabled フィールドの値が含まれない | 低 | disabled なフィールドの値が必要なケースでは hidden input で別途送信する |
| 既存のインタラクションテスト・VRT が壊れる | 中 | disabled テストケースの更新が必要 |
