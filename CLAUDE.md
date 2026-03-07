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

スキルは `.claude/skills/` に配置している。`/スキル名` で呼び出す。

### TypeScript

- **`/ts-explore`** - コードベースの理解や調査（型情報確認、定義ジャンプ、呼び出し関係の追跡）
- **`/ts-refactor`** - 安全なリファクタリング（リネーム、関数分割、影響範囲の事前調査）
- **`/ts-diagnostics`** - 型エラー診断と自動修正（PR 変更ファイルの型チェックにも対応）

### コンポーネント

- **`/gen-component`** - Ark UI + Panda CSS のルールに従ってコンポーネントを新規作成
- **`/gen-component-doc`** - ソースコードから Docs ページと VRT ストーリーを生成・更新
- **`/component-audit`** - コンポーネントの品質監査（トークン準拠・Ark UI 統合・a11y）

### トークン

- **`/add-token`** - 命名規約に従ってデザイントークンを追加・修正
- **`/token-drift-audit`** - トークン定義と実使用の乖離（ドリフト）を検出

### その他

- **`/research`** - 外部ライブラリやデザインシステムの設計を調査・比較
- **`/update-rules`** - 作業後に CLAUDE.md やスキルへ追加すべきルールがないか確認

## エージェント

エージェントは `.claude/agents/` に配置している。`@エージェント名` で呼び出す。それぞれの専門的な立場からレビューや提案を行う。

- **`@designer`** - トークン設計・カラー体系・ビジュアル一貫性の観点
- **`@a11y-reviewer`** - WCAG/APCA・ARIA・キーボード操作のアクセシビリティ観点
- **`@code-reviewer`** - Panda CSS/Ark UI ルール準拠・型安全性の観点
- **`@documenter`** - Storybook Docs・Stories・VRT の品質と網羅性の観点
