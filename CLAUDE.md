# プロジェクトルール

## パッケージ管理

- `.npmrc` に `save-exact=true` を設定済み。パッケージバージョンはキャレット(`^`)やチルダ(`~`)を使わず、正確なバージョンで固定する
- 新規パッケージ追加時もバージョンが自動的に固定される

## ディレクトリ構成

- `.storybook/` - Storybook の設定ファイルを配置する
- `docs/decisions/` - ADR（Architecture Decision Records）を配置する
- `docs/research/` - 外部ライブラリやデザインシステムの調査ドキュメントを配置する
- `src/components/` - デザインシステムのコンポーネントを配置する（ドキュメント `{name}.docs.tsx` もここにコロケーションする）
- `src/tokens/` - トークン定義ファイルを配置する

## Panda CSS

- `@pandacss/preset-base` を使用（utility 定義のみ、トークン値は含まない）
- レシピで参照するトークンスケール（`radii`, `sizes`, `spacing` 等）は `src/tokens/` で必ず自前定義する
- `sizes` トークンは `spacing` を含む形で定義済み（`height: "8"` → `spacing.8` = 32px）
- トークン追加後は `npx panda codegen` で再生成する

## Storybook

- ストーリーファイルはコンポーネントと同じディレクトリに `{name}.stories.tsx` として配置する
- `tags: ["autodocs"]` を付けて自動ドキュメント生成を有効にする
- インタラクションテスト（`play` 関数）で主要な操作を検証する
- `npm run storybook` で開発サーバー起動、`npm run build-storybook` でビルド

## コミット

- コミットメッセージは日本語で書く
- `Co-Authored-By` は付けない
- Conventional Commits のプレフィックスを付ける（例: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`）
- 作業単位でコミットする。ひとまとまりの作業が完了したら `AskUserQuestion` ツールでコミットするか確認する
- 独立した変更は分割してコミットする。1つのコミットに無関係な変更を混ぜない
