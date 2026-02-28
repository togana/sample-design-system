---
name: ts-refactor
description: TypeScriptコードの安全なリファクタリング。findReferences/callHierarchy で影響範囲を事前調査し、rename で安全にリネーム、getDiagnostics で検証する。「リファクタリングしたい」「名前を変えたい」「リネームして」「関数を分割して」「この型を整理して」で発動。
---

# TypeScript リファクタリング支援スキル

TypeScript LSP のツール群を活用して、参照の漏れがない安全なリファクタリングを実現する。

## 前提条件

- TypeScript LSP プラグイン (`typescript-lsp@claude-plugins-official`) が有効
  - 有効になっていない場合はユーザーに確認する
- `typescript-language-server` がインストール済み
  - インストールされていない場合ユーザーに確認する

## LSP ツールの使用方針

**リファクタリングでは必ず LSP ツールを使うこと。手動の Grep 検索だけでは参照の見落としが発生する。**

| タスク | LSP ツール | 説明 |
|--------|----------|------|
| リネーム | `rename` | 複数ファイルに跨るシンボル名の一括変更 |
| 参照の全件確認 | `findReferences` | 関数・変数・型の使用箇所を漏れなく検出 |
| 定義元の確認 | `goToDefinition` | シンボルの定義場所に移動 |
| 実装の確認 | `goToImplementation` | インターフェースの実装箇所を特定 |
| 呼び出し階層 | `callHierarchy` | 関数の呼び出し元・呼び出し先を追跡 |
| 型情報 | `hover` | リファクタリング前後の型の確認 |
| エラー確認 | `getDiagnostics` | リファクタリング後のエラー有無を確認 |

## 実行フロー

### 1. リファクタリング対象の特定

ユーザーのリクエストから対象シンボルとリファクタリングの種類を特定。

### 2. 影響範囲の事前調査（必須）

1. `findReferences` で対象シンボルの全参照箇所を取得
2. `callHierarchy` で呼び出し階層を確認（関数の場合）
3. `goToImplementation` でインターフェースの実装を確認（型の場合）
4. **影響範囲をユーザーに報告してから作業開始**

報告例:
```
「buttonRecipe」の参照箇所:
- src/components/button/button.recipe.ts:5 (定義)
- src/components/button/button.tsx:3 (import・使用)
- src/components/button/button.stories.tsx:2 (import・Storybook)
- src/preset/theme/index.ts:12 (re-export)
合計: 4ファイル、5箇所
```

### 3. リファクタリングの実施

#### リネームの場合

`rename` ツールを使用。LSP の rename は参照箇所を自動的に更新する。

#### 関数の抽出・分割の場合

1. `documentSymbol` で対象ファイルの構造を把握
2. 対象コード範囲を特定
3. `findReferences` で抽出後に影響する参照を確認
4. 新しい関数を作成し、呼び出し元を更新

#### 型の整理の場合

1. `hover` で現在の型情報を確認
2. `findReferences` でその型を使用している全箇所を確認
3. 型の変更を実施
4. `getDiagnostics` で型エラーが発生していないか確認

### 4. リファクタリング後の検証（必須）

1. `getDiagnostics` を変更した全ファイルに対して実行
2. 新たなエラーが発生していないことを確認
3. `npx tsc --noEmit` で全体の型チェックを実行
4. Storybook のビルド確認が必要な場合は `npm run build-storybook` を実行

## 注意事項

- `styled-system/` ディレクトリは Panda CSS 自動生成なので編集禁止（変更は `src/preset/` のソースを修正し `npx panda codegen` で再生成）
- リファクタリング前に必ず影響範囲を報告し、ユーザーの確認を得ること
