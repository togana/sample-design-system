# ADR-004: Panda CSS の preset を preset-base のみに制限する

- ステータス: 承認済み
- 日付: 2026-02-22

## コンテキスト

Panda CSS の設定で `presets` を明示的に指定していなかったため、デフォルトの `@pandacss/preset-panda` が暗黙的に読み込まれていた。

`preset-panda` には以下が含まれている:

- 大量のプリセットカラー（red, blue, green 等のスケール）
- デフォルトの spacing, fontSize, breakpoints 等のトークン
- デフォルトの keyframes（spin, ping, bounce 等）

これらは独自のデザインシステムを構築するうえで以下の問題を引き起こす:

- **トークンの衝突**: 独自定義のトークンとプリセットのトークンが混在し、どちらが正しいか曖昧になる
- **意図しないスタイルの適用**: 開発者がプリセットのトークンを誤って使用し、デザインシステムの一貫性が損なわれるリスクがある
- **バンドルサイズ**: 使用しないトークンやユーティリティの定義が生成コードに含まれる

## 決定

`presets` を `["@pandacss/preset-base"]` のみに明示的に設定する。

### preset-base が提供するもの

- CSS ユーティリティプロパティの定義（`display`, `color`, `padding` 等を Panda CSS で使うための基盤）
- パターン（`flex`, `stack`, `grid` 等のレイアウトヘルパー）

### preset-base が提供しないもの

- カラースケール、spacing、fontSize 等のデザイントークン
- breakpoints のデフォルト値
- keyframes のデフォルト定義

### 設定の変更

```ts
export default defineConfig({
  presets: ["@pandacss/preset-base"],
  // ...
  theme: {
    // extend ではなく直接定義
    tokens: { ... },
    semanticTokens: { ... },
  },
});
```

`theme.extend` を `theme` に変更し、プリセットのテーマをマージする前提を排除した。

## 根拠

| 判断 | 選択 | 理由 |
|------|------|------|
| preset | `preset-base` のみ | 独自デザインシステムでは全トークンを自前で管理するため、プリセットのトークンは不要。CSS ユーティリティの基盤だけあればよい |
| theme の定義方法 | `extend` ではなく直接定義 | マージ対象のプリセットテーマがないため、`extend` は不要。直接定義により意図が明確になる |
