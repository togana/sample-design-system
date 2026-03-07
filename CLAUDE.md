# プロジェクトガイド

## パッケージ管理

- `.npmrc` に `save-exact=true` を設定済み。バージョンは正確なバージョンで固定される

## ディレクトリ構成

- `.storybook/` - Storybook の設定ファイル
- `docs/decisions/` - ADR（Architecture Decision Records）
- `docs/research/` - 外部ライブラリやデザインシステムの調査ドキュメント
- `src/components/` - デザインシステムのコンポーネント（ドキュメント `{name}.docs.tsx` もここにコロケーション）
- `e2e/vrt/` - Playwright によるビジュアルリグレッションテスト
- `src/preset/` - Panda CSS preset 関連ファイル（conditions, theme）
  - `src/preset/theme/tokens/` - プリミティブトークン定義
  - `src/preset/theme/semantic-tokens/` - セマンティックトークン定義
  - `src/preset/theme/styles/` - テキストスタイル等

## コマンド

- `npm run storybook` - 開発サーバー起動
- `npm run build-storybook` - Storybook ビルド
- `npm run test:storybook` - インタラクションテスト実行
- `npm run test:vrt` - ビジュアルリグレッションテスト実行
- `npm run test:vrt:update` - VRT ベースライン更新
- `npx panda codegen` - トークン追加後の再生成

## ルール

実装ルールは `.claude/rules/` に配置している。

- `panda-css.md` - Panda CSS のプリセット・厳格設定・スタイリング手法
- `component.md` - コンポーネントの Props 型・disabled/loading 実装・Ark UI・ファイル構成
- `token.md` - トークン命名規約・ロール体系・アクセシビリティ基準
- `storybook.md` - stories / VRT / docs のファイル分担・テスト
- `commit.md` - コミットメッセージ規約・コミット単位

## スキル

- コードベースの理解や調査には **`/ts-explore`** を使用する
- TypeScript のリファクタリングには **`/ts-refactor`** を使用する
- TypeScript の型エラー診断・修正には **`/ts-diagnostics`** を使用する
