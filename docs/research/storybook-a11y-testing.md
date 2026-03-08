# Storybook addon-a11y によるアクセシビリティテスト

> 調査日: 2026-03-08
> 対象バージョン: `@storybook/addon-a11y` 10.2.16, `storybook` 10.2.16, axe-core (addon-a11y 内蔵)

## サマリー

| 観点 | 現状 | 改善後 |
|------|------|--------|
| a11y パネル（手動確認） | 導入済み | そのまま活用 |
| CI での自動テスト | 未稼働（`test: 'todo'` がデフォルト） | `test: 'error'` で CI 失敗化 |
| 状態別テスト | ARIA 属性の手動アサーションのみ | axe-core による自動検証を追加 |
| ルールカスタマイズ | 未設定 | プロジェクト特性に合わせて調整 |

## 1. addon-a11y の自動テスト機構

### 動作原理

addon-a11y は **`afterEach` フック** で axe-core を自動実行する。play 関数内で明示的に `a11yRun()` を呼ぶ API は存在しない。

1. ストーリーが描画される（args により初期状態が決まる）
2. play 関数が実行される（インタラクションで DOM 状態が変化）
3. **play 関数完了後**、`afterEach` で `axe.run()` が実行される
4. 違反があれば addon 内部のアサーション機構でテスト失敗

つまり、**play 関数の完了時点の DOM 状態** に対して a11y チェックが走る。

### `parameters.a11y.test` の 3 モード

| 値 | CI での挙動 | 用途 |
|----|-------------|------|
| `'off'` | a11y チェックをスキップ | 特定ストーリーを除外 |
| `'todo'`（**デフォルト**） | 警告のみ、テストは通る | 段階的導入時の猶予 |
| `'error'` | 違反があればテスト失敗 | 本番運用 |

### 段階的導入戦略

```ts
// preview.ts — parameters に a11y 設定を追加
parameters: {
  a11y: {
    test: 'error',
  },
},

// 既存の違反があるストーリーだけ一時的に todo に
export const KnownIssue = meta.story({
  parameters: {
    a11y: { test: 'todo' },
  },
});
```

## 2. 状態別テストの方法

play 関数でインタラクション（フォーカス、クリック等）を行い、その**完了後の DOM 状態**に対して axe-core が自動実行される。1 つのストーリーで複数状態を順番にチェックすることはできないため、**状態ごとにストーリーを分ける**。

### フォーカス状態

```tsx
export const Focused = meta.story({
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // フォーカスを当てた状態で afterEach の axe チェックが走る
    await userEvent.tab();
  },
});
```

- `color-contrast` ルールは**計算済みスタイル**を参照するため、`:focus-visible` 適用後のテキスト前景/背景色でコントラスト比が評価される
- ただし `outline` のコントラストは `color-contrast` ルールの対象外（WCAG 2.4.11 Focus Appearance は axe-core の自動チェック範囲外）

### disabled / aria-disabled 状態

```tsx
export const Disabled = meta.story({
  args: { disabled: true },
});
```

**本プロジェクト固有の注意点:**

- axe-core はネイティブ `disabled` 属性を持つ要素のコントラストチェックを**免除**する（WCAG の「非アクティブなコンポーネントは例外」規定）
- **`aria-disabled="true"` の場合はコントラストチェックの対象になる** — axe はネイティブ `disabled` のみ除外するため
- 本プロジェクトは `aria-disabled` 方式を採用しているため、disabled 状態で意図的に低コントラストにしている場合、違反が報告される可能性がある

対処法:

```tsx
export const Disabled = meta.story({
  args: { disabled: true },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});
```

### readonly 状態

```tsx
export const ReadOnly = meta.story({
  args: { readOnly: true },
});
```

- `aria-readonly="true"` は `aria-allowed-attr` ルールでロールとの整合性がチェックされる
- 本プロジェクトでは Ark UI の `readOnly` + 手動 `data-disabled` で disabled 代替としているため、ARIA 属性の整合性が重点チェック対象

### エラー / aria-invalid 状態

```tsx
export const Invalid = meta.story({
  args: {
    invalid: true,
    errorText: "入力内容を確認してください",
  },
});
```

- `aria-invalid="true"` の妥当性は `aria-allowed-attr` / `aria-valid-attr-value` でチェック
- `aria-errormessage` / `aria-describedby` の参照先 ID が DOM に存在するかも検証される
- エラーメッセージのテキストコントラストも `color-contrast` で検証

### loading / aria-busy 状態

```tsx
export const Loading = meta.story({
  args: { isLoading: true },
});
```

- `aria-busy="true"` + `aria-disabled="true"` の組み合わせが妥当かチェックされる

## 3. axe-core ルール設定

### 設定パラメータ

| パラメータ | 用途 | axe-core API |
|---|---|---|
| `config` | ルールの有効/無効、カスタムルール定義 | `axe.configure()` |
| `options` | 実行時オプション（runOnly, checks 等） | `axe.run()` 第2引数 |
| `context` | 検査対象の DOM 範囲 | `axe.run()` 第1引数 |

### addon-a11y のデフォルト設定

- `region` ルールがデフォルト無効（コンポーネント単体テストではランドマークがないため）

### ルールカスタマイズ例

```ts
// preview.ts — WCAG タグで実行対象を絞る
parameters: {
  a11y: {
    options: {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
  },
},

// 特定ストーリーでルール無効化
export const Example = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});
```

## 4. 本プロジェクトに関連する主要ルール

| ルール ID | 説明 | Impact | 関連する状態 |
|---|---|---|---|
| `color-contrast` | WCAG 2 AA コントラスト比を満たすか | Serious | フォーカス、エラー |
| `aria-allowed-attr` | ロールに対して許可された ARIA 属性のみ使用 | Critical | readonly, disabled |
| `aria-valid-attr-value` | ARIA 属性値が有効か | Critical | エラー（`aria-errormessage` 参照先） |
| `aria-input-field-name` | ARIA input フィールドにアクセシブルな名前があるか | Serious | フォーム全般 |
| `label` | フォーム要素にラベルがあるか | Critical | フォーム全般 |
| `button-name` | ボタンにアクセシブルな名前があるか | Critical | Button |

全ルール一覧は [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md) を参照。

## 5. axe-core の限界

- APCA コントラスト基準（本プロジェクトの Lc 75 基準）は axe-core では未対応（WCAG 2.x のコントラスト比のみ）
- フォーカスインジケータの視認性（WCAG 2.4.11 Focus Appearance）は自動チェック対象外
- `outline` のコントラストは `color-contrast` ルールで検証されない

## 参考リンク

- [Storybook: Accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [axe-core API ドキュメント](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
- [axe-core ルール一覧](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [addon-a11y ソースコード](https://github.com/storybookjs/storybook/tree/next/code/addons/a11y)
