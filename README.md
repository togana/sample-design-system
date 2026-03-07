# sample-design-system

## ディレクトリ構成

```
├── docs/
│   └── decisions/       # ADR（Architecture Decision Records）
├── src/
│   ├── components/      # デザインシステムのコンポーネント
│   └── tokens/          # トークン定義ファイル
```

## テスト

### インタラクションテスト（Storybook）

Storybook の開発サーバーを起動した状態でテストを実行する。

```bash
# 1. Storybook を起動
npm run storybook

# 2. 別ターミナルでテストを実行
npm run test:storybook
```

> **Note:** Storybook を起動せずに `npm run test:storybook` を実行すると、`@storybook/addon-vitest` が Storybook を自動起動・停止しようとするが、Node.js 24 + macOS 環境では teardown 時に `EBADF` エラーが発生しプロセスが停止する既知の問題がある。

### ビジュアルリグレッションテスト（VRT）

```bash
npm run test:vrt
```

ベースラインの更新：

```bash
npm run test:vrt:update
```
