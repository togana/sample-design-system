---
name: ts-diagnostics
description: TypeScriptの型エラー診断と自動修正。getDiagnostics でエラー検出し、hover/goToDefinition/findReferences で分析・修正する。PR変更ファイルの型チェック（コードレビュー）にも対応。「型エラーを直して」「型チェックして」「このファイルの問題を見つけて」「PRの変更を型チェックして」で発動。
---

# TypeScript 型エラー診断・修正スキル

TypeScript LSP の `getDiagnostics` を中心に、型エラーの検出・分析・修正を行う。

## 前提条件

- TypeScript LSP プラグイン (`typescript-lsp@claude-plugins-official`) が有効
  - 有効になっていない場合はユーザーに確認する
- `typescript-language-server` がインストール済み
  - インストールされていない場合ユーザーに確認する

## LSP ツールの使用方針

**Grep/Read の前にまず LSP ツールを使うこと。**

| タスク | LSP ツール | 理由 |
|--------|-----------|------|
| エラー検出 | `getDiagnostics` | コンパイラレベルの正確なエラー情報 |
| 型情報の確認 | `hover` | TypeScript の型推論結果を正確に取得 |
| エラー原因の追跡 | `goToDefinition` | 型定義の元を正確に辿る |
| 修正影響の確認 | `findReferences` | 全参照箇所を漏れなく検出 |

## 実行フロー

### モード1: ファイル指定診断

#### 1. 対象ファイルの特定

ユーザーが指定したファイルまたはディレクトリを対象にする。指定がない場合は AskUserQuestion で確認。

#### 2. getDiagnostics で型エラーを検出

各エラーについて以下を確認:
- エラーコード（TS2345, TS2322 など）
- エラーメッセージ
- 発生位置（行番号）

#### 3. エラーの分析

各エラーに対して:
1. `hover` で関連するシンボルの型情報を取得
2. `goToDefinition` で型定義の元を確認
3. `findReferences` で同じシンボルが使われている他の箇所を確認（修正の影響範囲を把握）

#### 4. 修正案をユーザーに提示

エラーの深刻度で分類:
- **ERROR**: 必ず修正が必要
- **WARNING**: 修正推奨
- **HINT/INFO**: 任意

#### 5. 修正の適用と再診断

修正後、再度 `getDiagnostics` を実行して修正完了を確認。

### モード2: PR/変更ファイル診断（コードレビュー）

#### 1. 変更ファイルの取得

```bash
git diff --name-only origin/main...HEAD -- '**/*.ts' '**/*.tsx' '**/*.mts'
```

#### 2. 各変更ファイルに getDiagnostics を実行

#### 3. 変更に起因するエラーのみをフィルタリング

```bash
git diff origin/main...HEAD -- <file>
```

変更された行に関連するエラーのみを抽出。

#### 4. findReferences で参照影響を確認

変更されたエクスポートシンボルについて `findReferences` を実行し、他ファイルへの影響を確認。

## よくあるエラーパターン

| エラーコード | 説明 | 修正アプローチ |
|-------------|------|---------------|
| TS2345 | 引数の型不一致 | `hover` で期待される型を確認 |
| TS2322 | 代入の型不一致 | `goToDefinition` で型定義を確認 |
| TS2339 | 存在しないプロパティ | `hover` で実際の型を確認 |
| TS2307 | モジュール未解決 | tsconfig.json の paths を確認 |
| TS18048 | possibly undefined | オプショナルチェーンまたは型ガードを提案 |

## 注意事項

- `styled-system/` ディレクトリのファイルは編集禁止（Panda CSS 自動生成。変更は `src/preset/` のソースを修正し `npx panda codegen` で再生成）
- `as any` の使用は原則禁止。適切な型定義を探すこと
- 型修正後は `npx tsc --noEmit` で全体の型チェックも実行すること
