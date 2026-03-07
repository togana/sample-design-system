# Panda CSS ルール

## プリセット

- `presets: ["@pandacss/preset-base"]` のみ使用（utility 定義のみ、トークン値は含まない）
- プリセットのデフォルトトークンに依存しない — 必要なトークンはすべて `src/preset/theme/tokens/` で自前定義する
- レシピで参照するトークンスケール（`radii`, `sizes`, `spacing` 等）も自前定義が必要
- `sizes` トークンは `spacing` を含む形で定義済み（`height: "8"` → `spacing.8` = 32px）
- トークン追加後は `npx panda codegen` で再生成する

## 厳格設定

- `shorthands: false` — 省略記法（`bg`, `pos` 等）は禁止。正式なプロパティ名（`background`, `position`）を使う
- `strictTokens: true` — 定義済みトークン以外の値は型エラーになる
- `strictPropertyValues: true` — CSS プロパティに対して有効な値のみ許可
- `validation: "error"` — config バリデーション失敗時にエラーを投げる
- `minify` / `hash` は環境別に切り替え（開発: `false`, 本番: `true`）

### エスケープハッチ

`strictTokens` / `strictPropertyValues` が有効な状態でも、`[値]` 構文で任意の値を指定できる。例外的なケースに限り使用する。

```tsx
// NG: 型エラー
styled("p", { base: { fontSize: "123px" } })

// OK: エスケープハッチ
styled("p", { base: { fontSize: "[123px]" } })
```

## スタイリング手法

| パターン | 手法 |
|----------|------|
| 基本スタイリング | `styled.div`, `styled.button` 等の styled props |
| バリアント付きコンポーネント | `cva` + `styled("button", recipe)` |
| スロット付きコンポーネント | `sva` + `createStyleContext` |

### 禁止事項

- `css()` 関数は使わない → `styled` ファクトリで代替する
- `style` prop による直接スタイル指定は禁止 → `styled` ファクトリの props で指定する
- パターンコンポーネント（`Box`, `Flex`, `Stack` 等）は使わない
