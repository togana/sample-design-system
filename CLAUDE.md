# プロジェクトルール

## パッケージ管理

- `.npmrc` に `save-exact=true` を設定済み。パッケージバージョンはキャレット(`^`)やチルダ(`~`)を使わず、正確なバージョンで固定する
- 新規パッケージ追加時もバージョンが自動的に固定される

## ディレクトリ構成

- `docs/decisions/` - ADR（Architecture Decision Records）を配置する
- `src/components/` - デザインシステムのコンポーネントを配置する
- `src/tokens/` - トークン定義ファイルを配置する

## コミット

- コミットメッセージは日本語で書く
- `Co-Authored-By` は付けない
