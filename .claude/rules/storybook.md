# Storybook ルール

## ファイルの役割分担

### `{name}.stories.tsx` — autodocs 接続 + インタラクションテスト専用

- `play` 関数付きのインタラクションテストのみ配置する（`tags: ["!dev"]` でサイドバー非表示）
- バリアント・サイズ・状態のビジュアルショーケースは書かない（docs に集約）
- `argTypes` で全 props の `description` を明示的に設定する
- デフォルト値がある props には `table: { defaultValue: { summary: "値" } }` も設定する

### `{name}.vrt.stories.tsx` — VRT 専用

- `title: "VRT/ComponentName"` で VRT テストのフィルタ対象にする
- `tags: ["!dev", "!autodocs"]` でサイドバー・Docs に非表示
- play 関数なし。props のバリアント別に静的な描画のみ配置する
- インタラクションテスト用の `.stories.tsx` とは meta が異なるため分離する

### `{name}.docs.tsx` — ビジュアルショーケース + ガイドライン

- 全バリアント・サイズ・状態の描画、Do/Don't、アクセシビリティ情報を配置する
- `parameters.docs.page` 経由で Docs タブに接続する

## テスト

- Storybook のインタラクションテスト（`play` 関数）は Vitest で実行する
- VRT は Playwright `toHaveScreenshot()` を使用し、light / dark 両テーマで撮影する
- VRT のベースライン画像（`e2e/vrt/__screenshots__/`）は git にコミットする
