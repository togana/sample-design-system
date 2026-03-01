# プロジェクトルール

## パッケージ管理

- `.npmrc` に `save-exact=true` を設定済み。パッケージバージョンはキャレット(`^`)やチルダ(`~`)を使わず、正確なバージョンで固定する
- 新規パッケージ追加時もバージョンが自動的に固定される

## ディレクトリ構成

- `.storybook/` - Storybook の設定ファイルを配置する
- `docs/decisions/` - ADR（Architecture Decision Records）を配置する
- `docs/research/` - 外部ライブラリやデザインシステムの調査ドキュメントを配置する
- `src/components/` - デザインシステムのコンポーネントを配置する（ドキュメント `{name}.docs.tsx` もここにコロケーションする）
- `src/preset/` - Panda CSS preset 関連ファイル（conditions, theme）を配置する
  - `src/preset/theme/tokens/` - プリミティブトークン定義
  - `src/preset/theme/semantic-tokens/` - セマンティックトークン定義
  - `src/preset/theme/styles/` - テキストスタイル等

## Panda CSS

- `@pandacss/preset-base` を使用（utility 定義のみ、トークン値は含まない）
- レシピで参照するトークンスケール（`radii`, `sizes`, `spacing` 等）は `src/preset/theme/tokens/` で必ず自前定義する
- `sizes` トークンは `spacing` を含む形で定義済み（`height: "8"` → `spacing.8` = 32px）
- トークン追加後は `npx panda codegen` で再生成する

### スタイリングルール（プロジェクト全体）

- `css()` 関数は使わない → `styled` ファクトリ（`styled.div`, `styled.p` 等）で代替する
- `style` prop による直接スタイル指定は禁止 → `styled` ファクトリの props で指定する
- パターンコンポーネント（`Box`, `Flex`, `Stack` 等）は使わない

### コンポーネント Props 型

- Props 型は `type` で明示的に定義する（`interface` は使わない）
- `ComponentProps<typeof Styled...>` からの `Omit` / 継承はしない — 全 props を自前で列挙する

## Storybook

### stories と docs の役割分担

- `{name}.stories.tsx` — **autodocs 接続 + インタラクションテスト専用**
  - `play` 関数付きのインタラクションテストのみ配置する（`tags: ["!dev"]` でサイドバー非表示）
  - バリアント・サイズ・状態のビジュアルショーケースは **書かない**（docs に集約）
  - `argTypes` で全 props の `description` を明示的に設定する
  - デフォルト値がある props には `table: { defaultValue: { summary: "値" } }` も設定する
- `{name}.docs.tsx` — **ビジュアルショーケース + ガイドライン**
  - 全バリアント・サイズ・状態の描画、Do/Don't、アクセシビリティ情報を配置する
  - `parameters.docs.page` 経由で Docs タブに接続する

### テスト

- Storybook のインタラクションテスト（`play` 関数）は Vitest で実行する
- `npm run test-storybook` でインタラクションテストを実行
- `npm run storybook` で開発サーバー起動、`npm run build-storybook` でビルド

## コミット

- コミットメッセージは日本語で書く
- `Co-Authored-By` は付けない
- Conventional Commits のプレフィックスを付ける（例: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`）
- 作業単位でコミットする。ひとまとまりの作業が完了したら `AskUserQuestion` ツールでコミットするか確認する
- 独立した変更は分割してコミットする。1つのコミットに無関係な変更を混ぜない

## コード調査
- コードベースの理解や調査には **`/ts-explore` スキル**を使用すること
  - 型情報の確認（hover）、定義・実装へのジャンプ（goToDefinition/goToImplementation）、呼び出し関係の追跡（callHierarchy）、ファイル・プロジェクト構造の把握（documentSymbol/workspaceSymbol）が可能

## リファクタリング
- TypeScriptコードのリファクタリングには **`/ts-refactor` スキル**を使用すること
  - findReferences/callHierarchyで影響範囲を事前調査し、renameで安全にリネーム、getDiagnosticsで検証する

## 型エラー診断
- TypeScriptの型エラー診断・修正には **`/ts-diagnostics` スキル**を使用すること
  - getDiagnosticsでエラー検出し、hover/goToDefinition/findReferencesで分析・修正する
  - PR変更ファイルの型チェック（コードレビュー）にも対応
