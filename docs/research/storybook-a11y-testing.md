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
4. 違反があれば `vitest-axe` の `toHaveNoViolations()` でテスト失敗

つまり、**play 関数の完了時点の DOM 状態** に対して a11y チェックが走る。

### `parameters.a11y.test` の 3 モード

| 値 | CI での挙動 | 用途 |
|----|-------------|------|
| `'off'` | a11y チェックをスキップ | 特定ストーリーを除外 |
| `'todo'`（**デフォルト**） | 警告のみ、テストは通る | 段階的導入時の猶予 |
| `'error'` | 違反があればテスト失敗 | 本番運用 |

### 段階的導入戦略

```ts
// preview.ts — グローバルに error を設定
parameters: {
  a11y: {
    test: 'error',
  },
},

// 既存の違反があるストーリーだけ一時的に todo に
export const KnownIssue: Story = {
  parameters: {
    a11y: { test: 'todo' },
  },
};
```

## 2. 状態別テストの方法

play 関数でインタラクション（フォーカス、クリック等）を行い、その**完了後の DOM 状態**に対して axe-core が自動実行される。1 つのストーリーで複数状態を順番にチェックすることはできないため、**状態ごとにストーリーを分ける**。

### フォーカス状態

```tsx
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    // フォーカスを当てた状態で afterEach の axe チェックが走る
    await userEvent.tab();
  },
};
```

- `color-contrast` ルールは**計算済みスタイル**を参照するため、`:focus-visible` 適用後のテキスト前景/背景色でコントラスト比が評価される
- ただし `outline` のコントラストは `color-contrast` ルールの対象外（WCAG 2.4.11 Focus Appearance は axe-core の自動チェック範囲外）

### disabled / aria-disabled 状態

```tsx
export const Disabled: Story = {
  args: { disabled: true },
};
```

**本プロジェクト固有の注意点:**

- axe-core はネイティブ `disabled` 属性を持つ要素のコントラストチェックを**免除**する（WCAG の「非アクティブなコンポーネントは例外」規定）
- **`aria-disabled="true"` の場合はコントラストチェックの対象になる** — axe はネイティブ `disabled` のみ除外するため
- 本プロジェクトは `aria-disabled` 方式を採用しているため、disabled 状態で意図的に低コントラストにしている場合、違反が報告される可能性がある

対処法:

```tsx
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
};
```

### readonly 状態

```tsx
export const ReadOnly: Story = {
  args: { readOnly: true },
};
```

- `aria-readonly="true"` は `aria-allowed-attr` ルールでロールとの整合性がチェックされる
- 本プロジェクトでは Ark UI の `readOnly` + 手動 `data-disabled` で disabled 代替としているため、ARIA 属性の整合性が重点チェック対象

### エラー / aria-invalid 状態

```tsx
export const Invalid: Story = {
  args: {
    invalid: true,
    errorText: "入力内容を確認してください",
  },
};
```

- `aria-invalid="true"` の妥当性は `aria-allowed-attr` / `aria-valid-attr-value` でチェック
- `aria-errormessage` / `aria-describedby` の参照先 ID が DOM に存在するかも検証される
- エラーメッセージのテキストコントラストも `color-contrast` で検証

### loading / aria-busy 状態

```tsx
export const Loading: Story = {
  args: { isLoading: true },
};
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
// preview.ts — グローバル設定
parameters: {
  a11y: {
    options: {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
  },
},

// 特定ストーリーでルール無効化
export const Example: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
};

// 特定ルールだけ実行
export const Specific: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'aria-allowed-attr' }],
        disableOtherRules: true,
      },
    },
  },
};
```

## 4. 主要な axe-core ルール（フォーム・インタラクティブ要素）

### ARIA 関連

| ルール ID | 説明 | Impact |
|---|---|---|
| `aria-allowed-attr` | ロールに対して許可された ARIA 属性のみ使用 | Critical |
| `aria-required-attr` | ロールに必須の ARIA 属性が存在するか | Critical |
| `aria-valid-attr-value` | ARIA 属性値が有効か | Critical |
| `aria-input-field-name` | ARIA input フィールドにアクセシブルな名前があるか | Serious |

### フォーム関連

| ルール ID | 説明 | Impact |
|---|---|---|
| `label` | フォーム要素にラベルがあるか | Critical |
| `button-name` | ボタンにアクセシブルな名前があるか | Critical |

### カラーコントラスト関連

| ルール ID | 説明 | Impact |
|---|---|---|
| `color-contrast` | WCAG 2 AA コントラスト比を満たすか | Serious |
| `color-contrast-enhanced` | WCAG 2 AAA コントラスト比（デフォルト無効） | Serious |

### キーボード/フォーカス関連

| ルール ID | 説明 | Impact |
|---|---|---|
| `tabindex` | tabindex が 0 より大きくないか | Serious |
| `focus-order-semantics` | フォーカス可能な要素に適切なロールがあるか | Minor |

## 5. 現状の課題と改善点

### 現状

- `vitest.setup.ts` で `a11yAddonAnnotations` を `setProjectAnnotations` に登録済み — **基盤は整っている**
- ただし `parameters.a11y.test` がデフォルト `'todo'` のため、**CI でテスト失敗にならない**
- play 関数では ARIA 属性の手動アサーション（`toHaveAttribute("aria-disabled", "true")` 等）のみ
- axe-core ルールのカスタマイズなし

### 改善案

1. **`preview.ts` で `a11y.test: 'error'` を設定** — CI で a11y 違反を検知
2. **状態別ストーリーの追加** — フォーカス・disabled・invalid 等の状態ごとにストーリーを作成し、afterEach で axe-core が自動検証
3. **`aria-disabled` 方式に合わせたルール調整** — disabled 状態のコントラストチェック除外を検討
4. **既存違反の段階的対応** — まず `'todo'` で既存違反を把握、修正後に `'error'` へ移行

### axe-core の限界

- APCA コントラスト基準（本プロジェクトの Lc 75 基準）は axe-core では未対応（WCAG 2.x のコントラスト比のみ）
- フォーカスインジケータの視認性（WCAG 2.4.11 Focus Appearance）は自動チェック対象外
- `outline` のコントラストは `color-contrast` ルールで検証されない

## 参考リンク

- [Storybook: Accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [axe-core API ドキュメント](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
- [axe-core ルール一覧](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [addon-a11y ソースコード](https://github.com/storybookjs/storybook/tree/next/code/addons/a11y)
