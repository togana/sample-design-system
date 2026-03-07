# ADR-009: ビジュアルリグレッションテストに Playwright toHaveScreenshot() を採用する

- ステータス: 承認済み
- 日付: 2026-03-07

## コンテキスト

デザインシステムのコンポーネントが意図しない見た目の変更（ビジュアルリグレッション）を検知する仕組みが必要になった。

現在のテスト構成:

- インタラクションテスト: Vitest + @storybook/addon-vitest（play 関数）
- a11y テスト: @storybook/addon-a11y

見た目の変更を自動検知する手段がなく、CSS の変更やトークンの更新が予期しないコンポーネントに影響を与えるリスクがある。

## 決定

**Playwright の `toHaveScreenshot()`** を使用したビジュアルリグレッションテストを導入する。

### 構成

- Storybook をビルド → 静的サーバーで配信 → 各ストーリーを自動検出・スクリーンショット比較
- ベースライン画像は `e2e/vrt/__screenshots__/` に git 管理
- light / dark 両テーマで全ストーリーを撮影（`page.evaluate()` で `data-color-mode` 属性を直接設定）
- 既存の Vitest インタラクションテストとは完全に独立
- VRT 対象は `title: "VRT/..."` プレフィックスのストーリーのみ（`index.json` からフィルタ）

### VRT 専用ストーリー

インタラクションテスト用の `.stories.tsx` とは分離し、`*.vrt.stories.tsx` ファイルに配置する。

- `title: "VRT/ComponentName"` — VRT テストのフィルタ対象
- `tags: ["!dev", "!autodocs"]` — Storybook のサイドバー・Docs タブに非表示
- play 関数なし — props のバリアント別に静的な描画のみ

```
src/components/button/button.vrt.stories.tsx   # styleType, size, disabled, loading
src/components/checkbox/checkbox.vrt.stories.tsx # checked, disabled, helperText
```

### コマンド

```bash
npm run build-storybook       # Storybook ビルド（前提）
npm run test:vrt               # VRT 実行（差分比較）
npm run test:vrt:update        # ベースライン更新
```

## 根拠

1. **Playwright がプロジェクトに導入済み**: `playwright` 1.58.2 が `@vitest/browser-playwright` の依存として存在する。`@playwright/test` を追加するだけで VRT が実現できる
2. **`toHaveScreenshot()` のビルトインサポート**: ピクセル差分比較、閾値設定、アニメーション無効化、ベースライン管理がライブラリ組み込みで提供される
3. **外部 SaaS が不要**: ベースライン画像を git 管理するため、Chromatic 等の外部サービスへの依存・コストがない
4. **既存テスト構成との分離**: Vitest のインタラクションテストと完全に独立しており、相互に影響しない

### 不採用とした選択肢

| ツール | 理由 |
| --- | --- |
| Chromatic | 外部 SaaS。コストが見合わない |
| Percy | 同上 |
| reg-suit + Storycap | セットアップが複雑。Playwright のビルトイン機能で十分 |
| Vitest browser mode + screenshot | `toHaveScreenshot()` 相当の機能が Vitest に存在しない |

## 今後の拡張

- GitHub Actions での CI 自動実行
- フォントレンダリングの OS 差異対策（Docker ベースの実行環境統一）
