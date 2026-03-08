# Ark UI vs React Aria: ヘッドレス UI ライブラリ比較

> 調査日: 2026-03-08
> 対象バージョン: @ark-ui/react 5.34.1 / react-aria-components (最新)
> 目的: disabled 状態のフォーカス維持を中心とした a11y 実装の比較、移行判断の材料

## サマリー

| 項目 | Ark UI | React Aria |
|---|---|---|
| **提供元** | Chakra Systems | Adobe |
| **GitHub Stars** | ~5,000 | ~14,900 |
| **コントリビューター** | 85名 | 476名 |
| **アーキテクチャ** | Zag.js ステートマシン + コンポーネント | Hooks + Components (RAC) の2層 |
| **フレームワーク対応** | React / Vue / Solid / Svelte | React 専用 |
| **コンポーネント数** | 45+ | 50+ |
| **disabled 方式** | ネイティブ `disabled`（フォーカス喪失） | ネイティブ `disabled`（フォーカス喪失） |
| **disabled フォーカス維持** | `readOnly` + 手動 `data-disabled` で回避可能 | Hooks フォールバックで可能だが RAC レベルでは不可 |
| **WAI-ARIA 準拠** | Zag.js レベルで実装 | APG 厳格準拠、実機スクリーンリーダーテスト実施 |
| **Panda CSS 親和性** | `createStyleContext` で直接統合（同チーム開発） | コミュニティプリセットあり、`styled()` ラップは制約あり |
| **スタイリング手法** | `asChild` / data-scope / data-part | className callback / data 属性 / render props |
| **オープン Issues** | 7件 | ~655件 |

## 1. disabled 実装の比較（核心の論点）

### 両ライブラリの共通点

**どちらもネイティブ `disabled` をデフォルトで付与し、フォーカスを喪失させる。**

これは業界全体の課題であり、Radix UI も同様の挙動を示す。disabled 状態でフォーカスを維持するには、どちらのライブラリでもワークアラウンドが必要になる。

### Ark UI の回避策（現行プロジェクト）

`readOnly` + 手動 `aria-disabled` + 手動 `data-disabled` 伝播:

```tsx
// Checkbox での実装（ADR-008）
<StyledRoot
  readOnly={disabled || undefined}      // Zag.js が onClick を preventDefault
  aria-disabled={disabled || undefined}  // AT に非活性を通知
  data-disabled={disabled || undefined}  // スタイリング用
>
  <StyledControl data-disabled={disabled || undefined}>
    {/* ... */}
  </StyledControl>
  <StyledLabel data-disabled={disabled || undefined}>
    {label}
  </StyledLabel>
  <ArkCheckbox.HiddenInput aria-disabled={disabled || undefined} />
</StyledRoot>
```

- `readOnly` を渡すと Zag.js 内部で `onClick` が `preventDefault()` でガードされる
- hidden input にネイティブ `disabled` が付与されないため、フォーカス可能性が維持される
- `data-disabled` を5〜6箇所に手動伝播する必要がある

### React Aria の回避策

RAC の `isDisabled` はネイティブ `disabled` を付与するため、フォーカス維持には Hooks API へのフォールバックが必要:

```tsx
import { useCheckbox } from "@react-aria/checkbox";
import { useToggleState } from "@react-stately/toggle";

function AccessibleCheckbox({ isDisabled, children, ...props }) {
  const ref = useRef<HTMLInputElement>(null);
  const state = useToggleState(props);
  const { inputProps } = useCheckbox(
    { ...props, isDisabled: false }, // disabled を渡さない
    state,
    ref
  );

  return (
    <label data-disabled={isDisabled || undefined}>
      <input
        {...inputProps}
        ref={ref}
        aria-disabled={isDisabled || undefined}
        onChange={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          inputProps.onChange?.(e);
        }}
      />
      {children}
    </label>
  );
}
```

- RAC のコンポーネントでは `aria-disabled` を手動設定しても反映されない問題がある（[Issue #8687](https://github.com/adobe/react-spectrum/issues/8687)）
- Hooks にフォールバックすると RAC の自動 DOM 構造・data 属性付与・スタイリング API が使えなくなる
- 結果的に現行の Button 実装（ネイティブ `<button>` + 手動 `aria-disabled`）と同等のコード量になる

### コレクション系コンポーネントの例外

React Aria の ListBox / Menu には `disabledBehavior` オプションがある:

```tsx
// disabledBehavior="selection": フォーカスは可能、選択のみ無効
<ListBox disabledKeys={["item1"]} disabledBehavior="selection">
  <ListBoxItem id="item1">項目1</ListBoxItem>
</ListBox>
```

Ark UI にはこのオプションに相当する機能はない。ただし現行プロジェクトではコレクション系コンポーネントは未使用。

## 2. アクセシビリティ品質

### Ark UI

- Zag.js レベルで WAI-ARIA パターンに準拠
- `data-state`, `data-disabled`, `data-focus`, `data-focus-visible` 等を自動付与
- キーボード操作は各コンポーネントに組み込み済み（Checkbox: Space、RadioGroup: 矢印キー等）
- `isFocusVisible()` でマウス/キーボードのフォーカスを区別
- スクリーンリーダーでの実機テストについては明示的な記載なし

### React Aria

- WAI-ARIA APG に**厳格に**準拠（逸脱を許容しない方針）
- VoiceOver / JAWS / NVDA / TalkBack での実機テストを実施
- RTL 言語でのキーボードナビゲーション対応
- ライブリージョンによるスクリーンリーダーアナウンス
- i18n 統合（40以上の言語）

**React Aria のアクセシビリティ品質は業界トップクラス。** Adobe の Spectrum デザインシステム（Creative Cloud 等）の基盤として実績がある。

## 3. Panda CSS との統合

### Ark UI（現行）

同チーム（Chakra Systems）開発のため統合がスムーズ:

```tsx
// createStyleContext + sva でスロット自動配布
const { withProvider, withContext } = createStyleContext(checkboxRecipe);
const StyledField = withProvider(Field.Root, "field");
const StyledRoot = withContext(ArkCheckbox.Root, "root");
const StyledControl = withContext(ArkCheckbox.Control, "control");
```

- `data-*` 属性と Panda CSS conditions が直接対応
- `styled()` ラップが自然に機能
- Park UI が公式リファレンス実装として存在

### React Aria

`styled()` ラップは可能だが制約がある:

```tsx
// styled() ラップは基本動作する
const StyledButton = styled(Button, {
  base: { paddingInline: "4", borderRadius: "md" },
});

// ただし className callback（render props）との併用は不可
// styled() が className を文字列で上書きするため
```

**`createStyleContext` パターンは使えない。** React Aria はパーツ分割が粗く、内部は children render props で自前の HTML 要素を配置する設計:

```tsx
// sva は使えるが、手動で className を配布する必要がある
const classes = checkboxRecipe();
<RACCheckbox className={classes.root}>
  {({ isSelected }) => (
    <>
      <div className={classes.control}>
        {isSelected && <CheckIcon />}
      </div>
      <span className={classes.label}>{label}</span>
    </>
  )}
</RACCheckbox>
```

### data 属性の互換性

| 状態 | Ark UI | React Aria | Panda CSS condition | 互換性 |
|------|--------|-----------|-------------------|--------|
| チェック済み | `data-state="checked"` | `data-selected` | `_checked` / `_selected` | 要変更 |
| 無効 | `data-disabled` | `data-disabled` | `_disabled` | 互換あり |
| フォーカス | `data-focus-visible` | `data-focus-visible` | `_focusVisible` | 互換あり |
| ホバー | `data-hover` | `data-hovered` | `_hover` | 要カスタム |
| フォーカス中 | `data-focus` | `data-focused` | `_focus` | 要カスタム |
| 不正値 | `data-invalid` | `data-invalid` | `_invalid` | 互換あり |

移行時は `_checked` → `_selected` への書き換え、conditions への `data-hovered` / `data-focused` 追加が必要。

### 現行ルールとの衝突

現行ルールでは `css()` 関数を禁止し `styled` ファクトリで代替する方針だが、React Aria との統合では `cva()` で className を生成するパターンが最も自然。ルール変更が必要になる。

## 4. コンポーネント種類の比較

### Ark UI にあって React Aria にないもの

Signature Pad, QR Code, Clipboard, Timer, Splitter

### React Aria にあって Ark UI にないもの

Tree, GridList, Table（高機能）, Virtualizer, Autocomplete（Alpha）, Breadcrumbs, Meter, DropZone

### 両方にあるもの

Button, Checkbox, RadioGroup, Switch, Select, Combobox, Slider, DatePicker, Calendar, ColorPicker, Dialog, Popover, Tooltip, Menu, Tabs, Accordion, Toast, NumberInput, TagGroup, Pagination, ProgressBar

## 5. 移行コストの評価

### 高コスト項目

| 項目 | 内容 | 影響度 |
|------|------|--------|
| **disabled 方式の再設計** | `aria-disabled` フォーカス維持を RAC で実現するには Hooks フォールバックが必要。RAC の利点が大幅に減少 | 大 |
| **スタイリング基盤の変更** | `createStyleContext` 廃止、手動 className 配布、`css()` 禁止ルールの見直し | 大 |
| **全コンポーネントの書き直し** | パーツ構造・Props 名・イベントハンドラが異なり、ほぼ全面書き直し | 大 |

### 中コスト項目

| 項目 | 内容 | 影響度 |
|------|------|--------|
| **recipe の書き換え** | `_checked` → `_selected`、conditions カスタマイズ | 中 |
| **Field 統合の再設計** | Ark UI の `Field.Root` / `Field.HelperText` との1対1マッピング不可 | 中 |
| **ADR の更新** | ADR-007, 008, 011 の設計判断を React Aria ベースに書き直し | 中 |

### Props 名の変更

| 機能 | Ark UI | React Aria |
|---|---|---|
| 無効化 | `disabled` | `isDisabled` |
| チェック状態 | `checked` / `defaultChecked` | `isSelected` / `defaultSelected` |
| チェック変更 | `onCheckedChange` | `onChange` |
| 値変更 | `onValueChange` | `onChange` |
| バリデーション | `invalid` / `required` / `readOnly` | `isInvalid` / `isRequired` / `isReadOnly` |

## 6. disabled フォーカス維持は本当に必要か

### WCAG の規定

WCAG 2.1 / 2.2 には「disabled 要素をフォーカス可能にすべきか否か」を直接規定する成功基準は**存在しない**。ネイティブ `disabled` を使っても WCAG 違反にはならない。

### WAI-ARIA APG の見解

APG はコンテキスト依存の判断を求めている:

- **複合ウィジェット内（Menu, Menubar 等）**: disabled アイテムに `aria-disabled` を使い、キーボードナビゲーションの対象に含める
- **一般的な文脈**: disabled なインタラクティブ要素はフォーカス不可能であることが通常の期待

つまり、フォームの個別フィールドやボタンでは**ネイティブ `disabled` で問題ない**。

### スクリーンリーダーの実際の挙動

ネイティブ `disabled` でもスクリーンリーダーは要素を認識する:

| スクリーンリーダー | Tab キー | ブラウズモード（仮想カーソル） | 読み上げ |
|--|--|--|--|
| **NVDA** | スキップ | 到達可能、読み上げる | 「ボタン、利用不可」 |
| **JAWS** | スキップ | 到達可能 | 「ボタン、unavailable」 |
| **VoiceOver** | スキップ | 到達可能 | 「ボタン、dimmed」 |

完全に無視されるわけではない。Tab キーでスキップされるだけで、ブラウズモードでは存在を認識できる。

### 主要デザインシステムの実態

| デザインシステム | アプローチ |
|--|--|
| **React Spectrum (Adobe)** | ネイティブ `disabled` |
| **Carbon (IBM)** | ネイティブ `disabled` |
| **Lightning (Salesforce)** | ネイティブ `disabled` |
| **Fluent UI (Microsoft)** | `aria-disabled`（フォーカス維持） |
| **Atlassian** | `aria-disabled`（フォーカス維持） |
| **MUI** | 両方サポート（デフォルトはネイティブ `disabled`） |

業界として統一見解はなく**分裂している**。ネイティブ `disabled` を使うシステムが多数派。

### a11y 専門家の見解

`aria-disabled` を推奨する専門家（Adrian Roselli, Heydon Pickering, Kitty Giraudel, Sandrina Pereira）は存在するが、その主な根拠は:

1. **ツールチップで「なぜ無効か」を伝えられる** — ただし、ツールチップはモバイルで hover できない問題がある
2. **キーボードユーザーがボタンの存在に気づける** — ブラウズモードでは `disabled` でも認識可能

**「なぜ無効か」をユーザーに伝える手段はツールチップだけではない。** 常に可視のヘルプテキストで説明する方が、モバイル対応・発見性の両面で優れている。

### 結論

disabled フォーカス維持は「あると良い」レベルであり、WCAG 違反を回避するために必須ではない。フォーカス維持の主な利点（無効理由の伝達）は、**ボタン周辺の可視テキストで代替可能**であり、むしろ UX として優れている。

workaround のコスト（`readOnly` + 手動 `data-disabled` 伝播）と天秤にかけると、**ネイティブ `disabled` + 可視テキストによる説明**に方針転換するのが合理的。

## 7. 設計判断

### 方針転換: ネイティブ `disabled` + 可視テキストによる説明

調査の結果、以下の判断に至った:

1. **Ark UI を継続する**（React Aria への移行は不要）
2. **disabled の実装をネイティブ `disabled` に変更する**（`aria-disabled` + フォーカス維持の方針を撤回）
3. **disabled の理由は可視テキストで伝える**（ツールチップに頼らない）

これにより:
- Ark UI の `disabled` prop / Field.Root の `disabled` をそのまま使える
- `readOnly` + 手動 `data-disabled` 伝播の workaround が不要になる
- コンポーネントの実装が大幅に簡素化される

詳細は ADR-014 に記載。

### React Aria への移行が将来的に合理的になるケース

- コレクション系コンポーネント（Tree, GridList, Table 等）が多数必要になった場合
- アクセシビリティの品質保証を実機スクリーンリーダーテストレベルに引き上げたい場合

## 参考リンク

### Ark UI

- [Ark UI 公式](https://ark-ui.com/)
- [Ark UI GitHub](https://github.com/chakra-ui/ark)
- [Zag.js](https://zagjs.com/)
- [Park UI（Ark UI + Panda CSS リファレンス実装）](https://park-ui.com)

### React Aria

- [React Aria 公式](https://react-aria.adobe.com/)
- [React Aria アーキテクチャ](https://react-spectrum.adobe.com/architecture.html)
- [React Aria 品質・アクセシビリティ](https://react-aria.adobe.com/quality#accessibility)
- [adobe/react-spectrum GitHub](https://github.com/adobe/react-spectrum)

### disabled フォーカス維持に関する Issue

- [React Aria: Button の aria-disabled 問題 (#8687)](https://github.com/adobe/react-spectrum/issues/8687)
- [React Aria: disabled アイテムのフォーカス要望 (#3662)](https://github.com/adobe/react-spectrum/issues/3662)
- [Ark UI: Field.HelperText の data-disabled 伝播 (#3286)](https://github.com/chakra-ui/ark/issues/3286)

### Panda CSS + React Aria

- [pandacss-react-aria-components プリセット](https://github.com/kianomg/pandacss-react-aria-components)
- [Pandaria（React Aria + Panda CSS UI ライブラリ）](https://github.com/jeremy-code/pandaria)

### disabled フォーカス維持に関する議論

- [Don't Disable Form Controls — Adrian Roselli](https://adrianroselli.com/2024/02/dont-disable-form-controls.html)
- [On disabled and aria-disabled attributes — Kitty Giraudel](https://kittygiraudel.com/2024/03/29/on-disabled-and-aria-disabled-attributes/)
- [Making Disabled Buttons More Inclusive — CSS-Tricks](https://css-tricks.com/making-disabled-buttons-more-inclusive/)
- [Usability Pitfalls of Disabled Buttons — Smashing Magazine](https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/)
- [JAWS loses its place when a button with focus is set to disabled — Issue #774](https://github.com/FreedomScientific/standards-support/issues/774)

### 移行事例

- [Radix → React Aria 移行事例（Argos CI）](https://argos-ci.com/blog/react-aria-migration)
