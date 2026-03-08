# ADR-013: Storybook addon-a11y による自動アクセシビリティテストを導入する

- ステータス: 提案
- 日付: 2026-03-08

## コンテキスト

現在のテスト構成:

- インタラクションテスト: Vitest + @storybook/addon-vitest（play 関数）
- VRT: Playwright `toHaveScreenshot()`（light / dark 両テーマ）
- a11y: @storybook/addon-a11y のパネルによる手動確認のみ

`@storybook/addon-a11y` (10.2.16) は既に導入済みで、`vitest.setup.ts` に `a11yAddonAnnotations` も登録されている。しかし `parameters.a11y.test` がデフォルトの `'todo'` のため、a11y 違反があっても CI でテストが失敗しない。axe-core による自動検証のポテンシャルを活かせていない状態にある。

また、play 関数内での ARIA 属性の手動アサーション（`toHaveAttribute("aria-disabled", "true")` 等）は存在するが、axe-core のルールセット全体での網羅的な検証は行われていない。

## 決定

`parameters.a11y.test: 'error'` をグローバルに設定し、全ストーリーで axe-core による a11y 違反を CI で自動検知する。

### 設定変更

#### preview.ts

```ts
export default definePreview({
  addons: [addonA11y()],
  parameters: {
    a11y: {
      test: "error",
    },
  },
});
```

### テスト対象

`.stories.tsx`（インタラクションテスト用）と `.vrt.stories.tsx`（VRT 用）の両方を対象にする。

| ファイル | a11y テストの役割 |
|----------|------------------|
| `.stories.tsx` | play 関数完了後の DOM 状態（フォーカス、操作後のエラー表示等）で a11y チェック |
| `.vrt.stories.tsx` | 各バリアント・サイズ・状態の静的な描画に対して a11y チェック。状態の網羅性が高い |

### 動作原理

addon-a11y は `afterEach` フックで axe-core を自動実行する。play 関数内で明示的に呼び出す API は存在しない。

1. ストーリーが描画される（args により初期状態が決まる）
2. play 関数が実行される（インタラクションで DOM 状態が変化）
3. play 関数完了後、`afterEach` で `axe.run()` が実行される
4. 違反があれば `vitest-axe` の `toHaveNoViolations()` でテスト失敗

つまり、1 つのストーリーで複数の状態を順番にチェックすることはできない。状態ごとにストーリーを分ける必要がある。

### 状態別テストの方法

#### フォーカス状態

play 関数でフォーカスを当てた状態で afterEach の axe チェックが走る。

```tsx
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
  },
};
```

`color-contrast` ルールは計算済みスタイルを参照するため、`:focus-visible` 適用後のテキスト前景/背景色でコントラスト比が評価される。ただし `outline` のコントラストは対象外。

#### disabled / aria-disabled 状態

```tsx
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: false }],
      },
    },
  },
};
```

#### エラー / aria-invalid 状態

```tsx
export const Invalid: Story = {
  args: {
    invalid: true,
    errorText: "入力内容を確認してください",
  },
};
```

`aria-invalid`、`aria-errormessage` / `aria-describedby` の参照先の整合性、エラーメッセージのコントラストが自動検証される。

#### loading / aria-busy 状態

```tsx
export const Loading: Story = {
  args: { isLoading: true },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: false }],
      },
    },
  },
};
```

loading 時も `aria-disabled="true"` を付与するため、disabled と同様に `color-contrast` を無効化する。

### `aria-disabled` と `color-contrast` ルールの扱い

本プロジェクトはネイティブ `disabled` ではなく `aria-disabled="true"` を採用している（ADR-007, ADR-008）。axe-core はネイティブ `disabled` 属性を持つ要素のみコントラストチェックを免除する（WCAG の「非アクティブなコンポーネントは例外」規定に基づく）。`aria-disabled` 方式では免除されないため、disabled 状態で意図的に低コントラストにしている場合に違反が報告される。

対処方針: **disabled / loading 状態のストーリーで `color-contrast` ルールを個別に無効化する**。

```tsx
parameters: {
  a11y: {
    config: {
      rules: [{ id: "color-contrast", enabled: false }],
    },
  },
},
```

### 導入戦略

初期から `test: 'error'` で導入する。既存ストーリーで a11y 違反が検出された場合は、ストーリー単位で `'todo'` に設定して一時的に警告に留め、修正後に `'todo'` を除去する。

```tsx
// 既存違反があるストーリーの一時的な猶予
export const KnownIssue: Story = {
  parameters: {
    a11y: { test: "todo" },
  },
};
```

### axe-core ルールのデフォルト設定

addon-a11y は `region` ルールをデフォルトで無効化している（コンポーネント単体テストではランドマークが存在しないため）。それ以外のカスタマイズは初期段階では行わず、WCAG 2.0/2.1 Level A & AA + Best Practices のデフォルトルールセットで運用する。

### axe-core の検出対象外

以下は axe-core の自動チェック範囲外であり、手動レビューや別の仕組みで補完する必要がある。

| 項目 | 理由 |
|------|------|
| APCA コントラスト基準（Lc 75） | axe-core は WCAG 2.x のコントラスト比のみ対応 |
| フォーカスインジケータの視認性（WCAG 2.4.11） | `outline` のコントラストは `color-contrast` ルールの対象外 |
| キーボード操作の網羅性 | axe-core は DOM の静的解析であり、キーボードナビゲーションの動作はテストしない |

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| 初期モード | `'error'` | 違反を早期に検知する。猶予が必要なストーリーだけ `'todo'` に個別設定する方が、見落としが少ない |
| テスト対象 | `.stories.tsx` と `.vrt.stories.tsx` の両方 | VRT 用は状態の網羅性が高く a11y チェックとの相性がよい。インタラクションテスト用は操作後の状態をカバーする |
| disabled の `color-contrast` | ストーリー単位で無効化 | `aria-disabled` 方式の制約であり、WCAG 上も非アクティブコンポーネントはコントラスト基準の対象外。グローバルに無効化するとアクティブ状態のコントラスト違反を見逃すため、個別に設定する |
| ルールカスタマイズ | デフォルトルールセットで開始 | 過度なカスタマイズは検出漏れにつながる。運用しながら必要に応じて調整する |

## 今後の拡張

- APCA コントラスト基準のカスタムルール追加（axe-core の拡張 API を使用）
- GitHub Actions での CI 自動実行（ADR-009 の VRT CI 化と合わせて検討）
