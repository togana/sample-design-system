# プロジェクトルール

## パッケージ管理

- `.npmrc` に `save-exact=true` を設定済み。パッケージバージョンはキャレット(`^`)やチルダ(`~`)を使わず、正確なバージョンで固定する
- 新規パッケージ追加時もバージョンが自動的に固定される

## ディレクトリ構成

- `.storybook/` - Storybook の設定ファイルを配置する
- `docs/decisions/` - ADR（Architecture Decision Records）を配置する
- `docs/components/` - コンポーネントのドキュメントを配置する
- `src/components/` - デザインシステムのコンポーネントを配置する
- `src/tokens/` - トークン定義ファイルを配置する

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
