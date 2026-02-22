# ADR-005: コンポーネント開発・テスト環境に Storybook を採用する

- ステータス: 承認済み
- 日付: 2026-02-22

## コンテキスト

デザインシステムのコンポーネントを隔離環境で開発・テスト・ドキュメント化するためのツールが必要になった。

現在のプロジェクト構成:

- React 19 + Next.js 16 + Panda CSS + Ark UI
- `reactCompiler: true` を有効化済み

以下の 4 ツールを比較調査した（詳細は [docs/research/component-development-tools-comparison.md](../research/component-development-tools-comparison.md) を参照）:

| ツール | バージョン | 判定 |
|---|---|---|
| Storybook | 10.2.10 | **採用** |
| Ladle | 5.1.1 | 不採用 |
| React Cosmos | 7.1.1 | 不採用 |
| Histoire | 0.17.17 | 採用不可（React 未サポート） |

## 決定

**Storybook 10** をコンポーネント開発・テスト環境として採用する。

フレームワーク統合には `@storybook/nextjs-vite`（Vite ビルダー）を使用する。

## 根拠

### Storybook を選ぶ理由

1. **Next.js 16 との互換性**: `@storybook/nextjs-vite` が Next.js 14/15/16 を公式サポートしている。他ツールは Next.js 統合がないか未検証
2. **Panda CSS の公式サポート**: Panda CSS 公式ドキュメントに [Storybook 連携ガイド](https://panda-css.com/docs/installation/storybook) が存在する
3. **デザインシステムとの相性**: autodocs による Props テーブル自動生成、Controls による props のリアルタイム操作がコンポーネントカタログとして機能する
4. **テスト機能の統合**: Interaction testing（play 関数）、a11y テスト（axe-core）、Visual testing（Chromatic）が一体で使える
5. **エコシステム**: 400 以上のアドオン。Figma 連携、MSW、テーマ切り替え等の拡張が必要になった際に対応可能
6. **コミュニティ規模**: npm 月間 5,100 万 DL。トラブル時の情報が最も見つかりやすい
7. **長期的な安定性**: Chromatic 社が開発を主導しており、メンテナンス継続に懸念がない

### 他ツールを選ばない理由

| ツール | 理由 |
|---|---|
| Ladle | Next.js 統合なし。CSF 3 未対応で play 関数が使えない。サードパーティアドオン不可。メンテナー 1 名でリリース間隔にムラがある |
| React Cosmos | Docs 生成・テスト機能がない。Next.js 16 対応が未検証。エコシステムが小さい |
| Histoire | React をサポートしていないため採用不可 |

### Vite ビルダーを選ぶ理由

| 指標 | Webpack | Vite |
|---|---|---|
| HMR | ~3.67 秒 | ~0.5 秒 |
| コールドスタート（最適化時） | ~30 秒 | ~37 秒 |

HMR の速度が開発体験に直結するため、Vite ビルダーを採用する。

## 導入時の注意点

- `panda.config.ts` の `include` にストーリーファイルのパスを含めること
- `@storybook/addon-themes` で `data-color-mode` 属性によるダークモード切り替えに対応すること
- React Compiler との動作は導入後に検証すること
