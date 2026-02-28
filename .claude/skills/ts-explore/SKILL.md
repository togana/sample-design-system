---
name: ts-explore
description: TypeScriptコードベースの理解と調査。hover で型情報確認、goToDefinition/goToImplementation で定義・実装にジャンプ、callHierarchy で呼び出し関係を追跡、documentSymbol/workspaceSymbol でファイル・プロジェクト構造を把握する。「この関数の型は？」「どこから呼ばれている？」「影響ある？」「この処理の流れを追いたい」「コードを理解したい」で発動。
---

# TypeScript コード理解・調査スキル

TypeScript LSP のツール群を活用して、コードベースの深い理解と正確な調査を支援する。

## 前提条件

- TypeScript LSP プラグイン (`typescript-lsp@claude-plugins-official`) が有効
  - 有効になっていない場合はユーザーに確認する
- `typescript-language-server` がインストール済み
  - インストールされていない場合ユーザーに確認する

## LSP ツール活用マップ

**コード調査では、Grep/Read の前にまず LSP ツールを使うこと。LSP は構文解析ベースなので、文字列一致の Grep よりも正確。**

| 調べたいこと | LSP ツール | 説明 |
|-------------|-----------|------|
| 関数・変数の型情報 | `hover` | 推論された型を正確に取得 |
| 定義場所 | `goToDefinition` | import 先を正確に解決（パスエイリアス対応） |
| 実装場所 | `goToImplementation` | インターフェースから実装箇所を特定 |
| 使用箇所 | `findReferences` | シンボルが使われている全箇所を一覧取得 |
| 呼び出し関係 | `callHierarchy` | 関数の呼び出し元・先の階層を取得 |
| ファイル構造 | `documentSymbol` | ファイル内の全シンボルを構造的に取得 |
| 名前でシンボル検索 | `workspaceSymbol` | プロジェクト全体でシンボル名を検索 |

## 調査パターン

### パターン1: 特定の関数・コンポーネントの理解

1. `hover` で型シグネチャを確認
2. `goToDefinition` で定義元に移動
3. `documentSymbol` でファイル内の構造を把握
4. `callHierarchy` で呼び出し関係を追跡
5. `findReferences` で使用箇所を確認

### パターン2: 処理フローの追跡

1. `callHierarchy` でエントリポイントから呼び出し先を辿る
2. 各関数で `hover` を使って入出力の型を確認
3. `goToDefinition` で各関数の実装を読む
4. 処理フローを整理してユーザーに説明

### パターン3: インターフェース・型の全体像把握

1. `workspaceSymbol` で型名を検索
2. `goToDefinition` で型定義に移動
3. `goToImplementation` で実装箇所を特定
4. `findReferences` で使用箇所を確認
5. 型の継承・依存関係を整理して説明

### パターン4: 「この変数/関数はどこから来ている？」

1. `hover` で型情報を確認
2. `goToDefinition` で定義元に移動
3. 必要に応じて `callHierarchy` で呼び出し階層を確認

### パターン5: ファイル全体の構造把握

1. `documentSymbol` でファイル内のシンボル一覧を取得
2. 各シンボルの `hover` で型情報を確認
3. 構造をサマリーとして整理

## 調査結果の報告フォーマット

### 関数/コンポーネントの場合

```
## [関数名/コンポーネント名]

**定義場所**: path/to/file.ts:行番号
**型シグネチャ**: (param: Type) => ReturnType
**呼び出し元** (N箇所):
  - path/to/caller1.tsx:行番号
  - path/to/caller2.tsx:行番号
**主な処理内容**: [簡潔な説明]
```

### 処理フローの場合

```
## 処理フロー: [機能名]

1. [エントリポイント] (path/to/entry.tsx)
   → 呼び出し
2. [関数A] (path/to/a.ts)
   → データ取得
3. [関数B] (path/to/b.ts)
   → 変換
4. [関数C] (path/to/c.ts) → 最終結果
```

## 注意事項

- LSP ツールの結果はコンパイラレベルの情報なので、Grep 結果よりも信頼性が高い
- ただし、LSP サーバーが起動していない場合はユーザーに確認すること
- 大規模な `findReferences` の結果は、重要度順にフィルタリングして報告する
- `styled-system/` ディレクトリのファイルは Panda CSS 自動生成（参照のみ、編集不可）
