# Pencil vs Figma: デザイントークン・コンポーネント設計ツール比較

調査日: 2026-02-22

## 背景

開発者のみのチームでデザインシステムを構築する場合、Figma の代わりに Pencil（MCP ベースの IDE ネイティブ設計ツール）を採用するメリット・デメリットを調査する。

---

## 1. Pencil とは

[Pencil.dev](https://www.pencil.dev/) は AI ネイティブのフロントエンド設計ツール。IDE（VS Code, Cursor）内で動作し、`.pen` ファイル（JSON ベース）でデザインを管理する。

### 主な特徴

- **Git ネイティブ**: `.pen` ファイルはリポジトリに直接コミット。ブランチ・マージ・diff が通常の Git ワークフローで可能
- **IDE 統合**: デザインとコードが同一環境。コンテキストスイッチ不要
- **MCP 統合**: Claude Code 等の AI エージェントが `.pen` ファイルを構造的に読み書き可能
- **変数・テーマ**: ライト/ダークモードのテーマ軸をサポート。CSS 変数との双方向同期が可能
- **AI コード生成**: `.pen` ファイルからトークン値・座標・構造を読み取り、React/Tailwind コンポーネントを生成
- **Figma インポート**: Figma からコピペでスタイル・スペーシング・レイヤー構造を保持

### 制約

| 項目 | 詳細 |
|------|------|
| プラットフォーム | Mac / Linux のみ（Windows・ブラウザ版なし） |
| リアルタイム共同編集 | 非対応 |
| 成熟度 | 2025年末〜2026年初頭に登場。ドキュメント・コミュニティが限定的 |
| 料金 | 現在は無料（早期アクセス）。将来の価格は未定 |
| AI 機能 | Claude Code サブスクリプション（$20/月〜）が別途必要 |

---

## 2. Figma のデザインシステム機能

### トークン管理

- **Variables**: カラー・数値・文字列・真偽値をサポート。スコープ指定（fill, stroke, spacing 等）可能
- **モード**: ライト/ダーク、ブランド差分、密度モードをネイティブサポート
- **エイリアス**: 変数が他の変数を参照可能 → Primitive/Semantic の 2 層構造を構築可能
- **業界採用率**: デザインシステムチームの 69.8% が Figma Variables に移行済み

### 開発者ハンドオフ

- **Dev Mode**: コンポーネント仕様・スペーシング・CSS スニペット・変数名を表示
- **Code Connect**: Figma コンポーネントとプロダクションコード（React 等）を直接リンク

### Token Studio

[Tokens Studio](https://tokens.studio/) が Figma とコードの主要な橋渡し:

- Figma のトークンを JSON にエクスポート
- バージョン管理（GitHub, GitLab）と同期
- W3C DTCG フォーマット対応
- 基本機能は無料、高度な機能は有料

### コスト（開発者のみのチーム）

| シートタイプ | 年額プラン（月額換算） | 用途 |
|---|---|---|
| Full Seat | ~$15/月 | 全機能 + Dev Mode |
| Dev Seat | ~$12/月 | Dev Mode + FigJam |
| Collab Seat | ~$5/月 | 閲覧 + FigJam |

3〜5 人の開発者チーム: **$36〜75/月**

---

## 3. 比較表

### コードファースト vs ビジュアルファースト

| 観点 | Pencil | Figma |
|------|--------|-------|
| パラダイム | コードファースト。IDE 内で設計、出力はコード | ビジュアルファースト。キャンバスで設計、コードにエクスポート |
| トークン定義 | コード（TypeScript/CSS）で定義 → Pencil にインポート | Variables UI で定義 → コードにエクスポート |
| コンポーネント作成 | AI が `.pen` + コードからコンポーネント生成 | キャンバスで設計 → Dev Mode/Code Connect で共有 |
| 反復速度 | コードで考える開発者には非常に高速 | ビジュアル探索・レイアウト実験にはより直感的 |

### バージョン管理

| 観点 | Pencil | Figma |
|------|--------|-------|
| Git 統合 | ネイティブ。`.pen` がリポジトリ内に存在 | 外部ツール（Tokens Studio 等）が必要 |
| ブランチ | 標準の Git ブランチ | Figma 独自のブランチ機能（Git と統合不可） |
| 差分確認 | PR で JSON diff が閲覧可能 | Figma のバージョン履歴（ビジュアルのみ） |
| コードレビュー | デザイン変更が PR で確認可能 | エクスポートステップなしには不可能 |

### トークン同期

| 観点 | Pencil | Figma |
|------|--------|-------|
| Panda CSS 連携 | 直接的。CSS 変数と双方向同期可能。コードが source of truth | Tokens Studio → JSON → Style Dictionary or 手動マッピングが必要 |
| W3C DTCG 対応 | 未対応 | Tokens Studio 経由で対応 |
| 自動化 | AI エージェントがプログラム的に読み書き | プラグインベース、CI/CD は Tokens Studio 経由 |

### 学習コスト

| 観点 | Pencil | Figma |
|------|--------|-------|
| 開発者の親和性 | 高い。IDE 内で完結 | 中程度。新しい環境だが業界標準 |
| ドキュメント | 少ない（初期段階） | 充実（成熟） |
| AI 支援 | コア機能。MCP で AI が設計を直接操作 | Dev Mode が補助するが、AI 生成は別の関心事 |

### コラボレーション

| 観点 | Pencil | Figma |
|------|--------|-------|
| リアルタイム共同編集 | 非対応 | 業界最高水準 |
| 非同期コラボ | Git PR、コードレビュー | コメント、Figma ブランチ |
| 外部ステークホルダー | コード/スクリーンショットの共有が必要 | ブラウザリンクで簡単に共有 |

---

## 4. 関連ツール・標準

### W3C Design Tokens 仕様

- 2025年10月に[初の安定版 (2025.10)](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) リリース
- ベンダー中立のトークンフォーマット
- Adobe, Amazon, Google, Microsoft, Meta, Figma, Shopify 等が支持
- リファレンス実装: Style Dictionary, Tokens Studio, Terrazzo

### Style Dictionary v4

- W3C DTCG フォーマットをファーストクラスサポート
- CSS, Sass, TypeScript, Android, iOS 等に変換
- Figma/Pencil どちらからでもトークン変換レイヤーとして利用可能

### Penpot（OSS 代替）

- オープンソースのデザインプラットフォーム
- [MCP サーバー](https://github.com/penpot/penpot-mcp)による AI 統合が進行中
- セルフホスト可能。プライバシー重視の場合に選択肢

---

## 5. 本プロジェクトへの適用評価

### 現状の構成

- Panda CSS + TypeScript でトークンをコード管理（`src/tokens/`）
- 2 層トークン（Primitive → Semantic）を ADR-001 で策定済み
- Ark UI をコンポーネント基盤に採用
- コンポーネント実装はこれから（Phase 2）

### Pencil が適している理由

1. **トークンが既にコードファースト**: `src/tokens/*.ts` が source of truth。Pencil はこれを直接インポート可能
2. **Git ネイティブ**: デザインとコードの同期に追加ツールが不要
3. **AI コンポーネント生成**: 開発者のみのチームでは「ハンドオフ」問題を解消
4. **追加コストなし**: 現在無料（Claude Code は既に利用中）
5. **コンテキストスイッチ不要**: IDE 内で完結

### Figma が依然必要なケース

1. **非開発者との協業**: デザイナー・ステークホルダーが参加する場合
2. **ビジュアル探索**: レイアウト・カラーパレットの初期検討には直感的
3. **エコシステム**: Tokens Studio, Supernova 等の成熟したツールチェーン
4. **安定性**: 10 年の実績。Pencil はまだ初期段階

### 推奨アプローチ

| 条件 | 推奨 |
|------|------|
| チームが 100% 開発者で外部協業なし | **Pencil のみ** で十分 |
| 将来デザイナーの参加可能性あり | Pencil メイン + Figma を必要時に併用 |
| 外部ステークホルダーへの共有が頻繁 | **Figma メイン**（共有の容易さが重要） |

#### コードファーストのワークフロー（推奨）

```
TypeScript トークン定義 (src/tokens/)
    ↓ source of truth
Panda CSS config (panda.config.ts)
    ↓ 自動生成
styled-system/
    ↓
Pencil (.pen) でコンポーネント設計 → AI がコード生成
    ↓
Git commit → PR レビュー（デザイン + コード）
```

---

## 6. Pencil → Figma 移行パスの調査

### 移行の実現可能性

Pencil から Figma への移行は **可能だが、公式の一括移行パスは存在しない**。レイヤーごとに異なるアプローチが必要。

### トークン移行（容易）

トークンはコードファーストで管理しているため、最も移行しやすい。

| ツール | 方式 | 特徴 |
|--------|------|------|
| **Figma ネイティブ** (2025年11月〜) | W3C DTCG JSON をドラッグ&ドロップ | プラグイン不要。一回限りのインポート向き |
| **[Tokens Studio](https://docs.tokens.studio)** | Git リポジトリと双方向同期 | 継続的な同期が必要な場合に最適 |
| **[Styleframe](https://www.styleframe.dev/figma)** | W3C DTCG + CLI 連携 | コードファースト。OSS。CI/CD 統合可能 |
| **[Style Dictionary v4](https://styledictionary.com/)** | ビルドツール | 変換レイヤーとして利用 |

#### 変換の流れ

```
Panda CSS tokens (src/tokens/*.ts)
    ↓  カスタムスクリプト or Style Dictionary
W3C DTCG JSON
    ↓  いずれかを選択
    ├→ Figma ネイティブインポート（一回限り）
    ├→ Tokens Studio（継続的な双方向同期）
    └→ Styleframe（コードファースト継続同期）
```

Panda CSS の `{ value: "#fafafa" }` は W3C DTCG の `{ "$value": "#fafafa", "$type": "color" }` にほぼ直接マッピングできる。セマンティックトークンの `{ base: "...", _dark: "..." }` は DTCG の 2 モード（light/dark）に変換可能。

### ビジュアルデザイン移行（中程度）

Figma コミュニティに `.pen` ファイルをインポートするプラグインが複数存在する:

| プラグイン | 特徴 |
|-----------|------|
| [Pencil to Figma](https://www.figma.com/community/plugin/1598907730561478304) | フレーム・テキスト・ベクター変換、Auto Layout 対応 |
| [Pencil to Figma PRO](https://www.figma.com/community/plugin/1598831035671659035) | ピクセルパーフェクト精度を謳う |
| [Pencil.dev to Figma (Free)](https://www.figma.com/community/plugin/1601664618009066049) | スクリーンを Figma フレームとして再現 |

Web ツール [penciltofigma.com](https://penciltofigma.com/) も利用可能。

**注意**: すべてコミュニティ製のサードパーティプラグイン。2025年末〜2026年初頭に登場した新しいツールのため、信頼性は事前にテストが必要。

#### 保持されるもの

- フレーム構造、位置、サイズ
- Auto Layout（水平/垂直、gap、padding）
- 塗り・線・角丸・不透明度
- テキスト内容・フォントサイズ・ウェイト
- レイヤー階層・命名

#### 失われるもの

- Figma コンポーネント定義（バリアント・プロパティ）
- 変数バインディング（トークン参照）
- ダークモード / テーマの条件分岐
- インタラクティブ状態（hover, focus, disabled）
- デザイン↔コードの同期設定

### コンポーネント移行（困難）

コンポーネントライブラリの移行が最も手間がかかる。

| 戦略 | 説明 | 工数 |
|------|------|------|
| **A: プラグインでインポート → 手動調整** | .pen をプラグインで取り込み、Figma コンポーネントに変換 | 中〜大 |
| **B: コードを仕様として Figma で再構築** | React/Panda CSS の実装を参照し Figma で新規作成 | 中（最も高品質） |
| **C: 段階的移行** | 新規コンポーネントから Figma で作成、既存は徐々に移行 | 小〜中（分散） |

**実用的な推奨**: 戦略 B または C。プラグインインポートはビジュアルの出発点にはなるが、Figma ネイティブのバリアント・プロパティ・変数バインディングの設定は手動作業が必要。

### 移行コストの見積もり

| レイヤー | 難易度 | 自動化可能性 | 備考 |
|---------|--------|-------------|------|
| トークン | 低 | 高（スクリプト化可能） | W3C DTCG 経由で変換 |
| ビジュアル | 中 | 中（プラグイン利用） | 手動調整が必要 |
| コンポーネント | 高 | 低（手動作業中心） | バリアント・状態の再設定 |

### 結論

**Pencil で始めて Figma に移行することは可能**。特にトークンはコードが source of truth であるため、Pencil に依存しておらず移行リスクは低い。コンポーネントの移行は手間がかかるが、Phase 2 でコンポーネント数が少ないうちに移行判断すればコストを抑えられる。

移行を見据えた場合の推奨事項:

1. **トークンはコードファーストを維持**: Pencil にも Figma にも依存しない中立的な source of truth
2. **W3C DTCG 対応を準備**: Style Dictionary による変換スクリプトを早期に用意しておく
3. **コンポーネント数が少ないうちに判断**: 5〜10 コンポーネント程度で移行判断すればコストは限定的
4. **.pen ファイルの構造を整理**: 移行時にプラグインが正しく読み取れるよう命名・階層を統一

---

## 参考リンク

- [Pencil.dev](https://www.pencil.dev/)
- [Pencil.dev AI Integration docs](https://docs.pencil.dev/getting-started/ai-integration)
- [Pencil.dev Variables docs](https://docs.pencil.dev/core-concepts/variables)
- [Design System Mastery with Figma Variables 2025/2026](https://www.designsystemscollective.com/design-system-mastery-with-figma-variables-the-2025-2026-best-practice-playbook-da0500ca0e66)
- [Figma Dev Mode Review 2025](https://skywork.ai/blog/figma-dev-mode-review-2025/)
- [Tokens Studio](https://tokens.studio/)
- [W3C Design Tokens 仕様](https://design-tokens.github.io/community-group/format/)
- [Style Dictionary v4](https://styledictionary.com/)
- [Penpot MCP Server](https://github.com/penpot/penpot-mcp)
