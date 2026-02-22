# コンポーネント開発・テスト環境ツールの比較調査

> 調査日: 2026-02-22
> 対象プロジェクト: React 19.2.3 + Next.js 16.1.6 + Panda CSS 1.8.2 + Ark UI 5.32.0

## サマリー（比較表）

| 項目 | Storybook 10.2.10 | Ladle 5.1.1 | React Cosmos 7.1.1 | Histoire 0.17.17 |
|---|---|---|---|---|
| **React 19 対応** | 対応済み | 対応済み | 対応済み | **非対応（React 未サポート）** |
| **Next.js 16 対応** | 対応済み（v10 で追加） | 非対応（Vite 専用） | 要検証（13.4+ を公式サポート） | 非対応 |
| **Panda CSS 互換性** | 良好（公式ガイドあり） | 動作見込み（公式事例なし） | 良好（PostCSS 経由） | 非対応 |
| **Ark UI 互換性** | 問題なし | 問題なし | 問題なし | 非対応 |
| **ビルドエンジン** | Vite / Webpack | Vite 6 | プロジェクトのバンドラーを利用 | Vite |
| **起動速度** | 中（Vite 版は高速） | 高速 | 高速（Next.js 依存） | - |
| **エコシステム** | 400+ アドオン | 組み込みのみ（拡張不可） | プラグインシステムあり（小規模） | - |
| **Docs 生成** | 充実（autodocs） | MDX のみ（限定的） | なし（MDX Fixture のみ） | - |
| **テスト機能** | Interaction / Visual / a11y | a11y（axe） | なし（外部ツール連携） | - |
| **GitHub Stars** | ~89,300 | ~2,900 | ~8,600 | ~3,500 |
| **npm 月間 DL** | ~5,100万 | ~64万 | ~8万 | ~26万 |
| **メンテナンス** | Chromatic 社が主導・非常に活発 | 個人（tajo）・リリース間隔にムラ | 個人（skidding）・継続的 | Vue/Svelte 専用 |
| **最終リリース** | 2026-02-18 | 2025-11-04 | 2026-02-04 | 2025-01-07 |
| **CSF 互換** | CSF 3（標準） | CSF 2 のみ | 独自 Fixture 形式 | 独自形式 |

## 各ツールの詳細

### 1. Storybook 10.2.10

#### 概要

UI コンポーネントを隔離環境で開発・テスト・ドキュメント化するためのフロントエンドワークショップ。最も広く使われているコンポーネント開発ツール。

#### 本プロジェクトとの互換性

| 条件 | 評価 |
|---|---|
| React 19 | v8.4.7 以降で対応済み |
| Next.js 16 | **v10 系で対応（v8 系は非対応）** |
| Panda CSS | 良好（[公式ガイド](https://panda-css.com/docs/installation/storybook)あり） |
| Ark UI | 問題なし（ヘッドレスのため） |
| React Compiler | 要検証（Web 環境での深刻な問題は未報告） |

#### セットアップ例

```bash
npx storybook@latest init
```

`panda.config.ts` の `include` にストーリーファイルのパスを追加:

```typescript
include: [
  "./src/**/*.{ts,tsx}",
  "./stories/**/*.{ts,tsx}",
  "./.storybook/**/*.{ts,tsx}",
],
```

`.storybook/preview.ts`:

```typescript
import '../styled-system/styles.css';
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-color-mode',
    }),
  ],
};

export default preview;
```

#### ストーリーファイルの例

```tsx
// src/components/button/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
  args: { onClick: fn(), children: 'ボタン' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: { variant: 'solid', children: '保存' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'キャンセル' },
};

// インタラクションテスト
export const ClickTest: Story = {
  args: { children: 'クリックテスト' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'クリックテスト' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

#### 主要機能

- **Controls**: props をリアルタイムに変更して表示確認。型推論による自動生成
- **Docs (autodocs)**: JSDoc/TSDoc から自動ドキュメント・Props テーブル生成
- **Interaction Testing**: `play` 関数でユーザー操作をシミュレート（vitest ベース）
- **Visual Testing**: Chromatic との統合でビジュアルリグレッションテスト
- **Accessibility**: axe-core ベースの WCAG 準拠チェック
- **400+ アドオン**: Figma 連携、MSW、Themes など

#### パフォーマンス（Vite ビルダー使用時）

| 指標 | 値 |
|---|---|
| コールドスタート | ~37秒（最適化時） |
| HMR | ~0.5秒 |
| プロダクションビルド | ~82秒 |

---

### 2. Ladle 5.1.1

#### 概要

Uber の元エンジニアが開発した、Vite ベースの軽量な React コンポーネント開発ツール。ゼロコンフィグ・単一パッケージで動作する。

#### 本プロジェクトとの互換性

| 条件 | 評価 |
|---|---|
| React 19 | v5.0.0 で対応済み（react-inspector の peerDeps 警告あり） |
| Next.js 16 | **非対応**（Vite 専用。Next.js 統合はない） |
| Panda CSS | 動作見込み（PostCSS 自動検出）。**公式事例なし** |
| Ark UI | 問題なし |

#### セットアップ例

```bash
npm install @ladle/react
```

`.ladle/components.tsx`:

```tsx
import type { GlobalProvider } from "@ladle/react";
import "../styled-system/styles.css";

export const Provider: GlobalProvider = ({ children }) => {
  return <div data-color-mode="light">{children}</div>;
};
```

#### ストーリーファイルの例

```tsx
// src/components/button/button.stories.tsx
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "./button";

export default {
  title: "Components / Button",
} satisfies StoryDefault;

export const Playground: Story<{
  label: string;
  variant: "solid" | "outline" | "ghost";
}> = ({ label, variant }) => (
  <Button variant={variant}>{label}</Button>
);

Playground.args = { label: "ボタン" };
Playground.argTypes = {
  variant: {
    options: ["solid", "outline", "ghost"],
    control: { type: "select" },
    defaultValue: "solid",
  },
};
```

#### 主要な制限

- **CSF 3 未対応**: `render` 関数、`play` 関数が使えない
- **サードパーティアドオン非対応**: 拡張性に制約
- **Next.js 統合なし**: Next.js の機能（Image, Link, Router など）が使えない
- **Docs 機能が限定的**: MDX のみ。autodocs のような自動生成なし
- **メンテナー1名**: リリース間隔にムラ（v5.0.3→v5.1.0 で約17ヶ月の空白）

---

### 3. React Cosmos 7.1.1

#### 概要

React 専用の軽量コンポーネントサンドボックス。ファイルシステムベースの Fixture 規約により、React の知識だけでコンポーネントの状態を定義できる。

#### 本プロジェクトとの互換性

| 条件 | 評価 |
|---|---|
| React 19 | v7.0 で対応済み |
| Next.js 16 | 要検証（公式は 13.4+ サポート。16 の明示的記載なし） |
| Panda CSS | 良好（Next.js の PostCSS パイプラインを利用） |
| Ark UI | 問題なし |

#### セットアップ例

```bash
npm i -D react-cosmos react-cosmos-next
```

`cosmos.config.json`:

```json
{
  "rendererUrl": {
    "dev": "http://localhost:3000/cosmos/<fixture>",
    "export": "/cosmos/<fixture>.html"
  },
  "globalImports": ["./src/app/globals.css"]
}
```

`src/app/cosmos/[fixture]/page.tsx`:

```tsx
import { nextCosmosPage, nextCosmosStaticParams } from 'react-cosmos-next';
import * as cosmosImports from '../../../../cosmos.imports';

export const generateStaticParams = nextCosmosStaticParams(cosmosImports);
export default nextCosmosPage(cosmosImports);
```

起動は2プロセス構成（Next.js + Cosmos）。

#### Fixture ファイルの例

```tsx
// src/components/button/button.fixture.tsx
import { Button } from './button';

export default {
  'Solid': <Button variant="solid">保存</Button>,
  'Outline': <Button variant="outline">キャンセル</Button>,
  'Ghost': <Button variant="ghost">詳細</Button>,
  'Disabled': <Button variant="solid" disabled>送信不可</Button>,
};
```

Hooks を使った動的 Fixture:

```tsx
'use client';
import { useFixtureSelect, useFixtureInput } from 'react-cosmos/client';
import { Button } from './button';

export default function ButtonPlayground() {
  const [variant] = useFixtureSelect('variant', {
    options: ['solid', 'outline', 'ghost'],
  });
  const [label] = useFixtureInput('label', 'ボタン');
  return <Button variant={variant}>{label}</Button>;
}
```

#### 主要な特徴

- **React ネイティブ**: Fixture は通常の React コンポーネント。独自 DSL がない
- **Server Components サポート**: Next.js 連携でネイティブ対応
- **軽量**: 最小限の依存関係
- **Props パネル自動生成**: Node Fixture で props を自動検出

#### 主要な制限

- **Docs 生成機能なし**: ドキュメント自動生成は Storybook に大きく劣る
- **テスト機能なし**: Interaction testing、Visual testing は外部ツールが必要
- **エコシステムが小規模**: a11y テスト等のアドオンが乏しい
- **メンテナー1名**: コミュニティ規模が小さい

---

### 4. Histoire 0.17.17

#### 概要

Vite ベースのコンポーネントストーリーツール。**Vue 3 と Svelte 専用であり、React はサポートされていない。**

GitHub Discussions で React サポートの要望が複数あるが、メンテナーからの回答はなく、ロードマップにも含まれていない。

**結論: 本プロジェクトでは採用不可。**

---

## 設計判断に向けた考察

### 推奨: Storybook 10

本プロジェクト（React 19 + Next.js 16 + Panda CSS + Ark UI）のデザインシステムには **Storybook 10** を推奨する。理由は以下の通り。

#### 採用理由

1. **Next.js 16 との互換性**: `@storybook/nextjs-vite` が Next.js 14/15/16 を公式サポート。他のツールは Next.js 統合が弱いか未検証
2. **Panda CSS の公式サポート**: Panda CSS 公式ドキュメントに Storybook 連携ガイドが存在する。トラブル時の情報が豊富
3. **デザインシステムとの相性**: autodocs による自動ドキュメント生成、Controls による props 操作は、デザインシステムの開発・検証・共有に不可欠
4. **テスト機能の充実**: Interaction testing（play 関数）、a11y テスト（axe-core）、Visual testing（Chromatic）が統合されている
5. **エコシステム**: 400+ アドオン。将来的に Figma 連携、MSW、テーマ切り替え等が必要になった際にも対応可能
6. **コミュニティ**: npm 月間 5,100 万 DL。問題発生時の情報が最も見つかりやすい
7. **長期的な安定性**: Chromatic 社がバックについており、メンテナンス継続に懸念がない

#### 他ツールを選ばない理由

| ツール | 不採用理由 |
|---|---|
| **Ladle** | Next.js 統合なし。CSF 3 未対応。サードパーティアドオン不可。メンテナー1名でリリース間隔にムラ。Panda CSS の公式事例なし |
| **React Cosmos** | Docs 生成・テスト機能がない。Next.js 16 対応が未検証。エコシステムが小さい |
| **Histoire** | React 未サポートのため採用不可 |

#### 導入時の注意点

1. **Storybook v10 を使うこと**: v8 系は Next.js 16 非対応
2. **`@storybook/nextjs-vite` を選択すること**: HMR が高速（~0.5秒）
3. **`panda.config.ts` の `include` にストーリーファイルを含めること**
4. **React Compiler との動作検証**: `reactCompiler: true` が Storybook ビルドに影響する可能性がある
5. **ダークモード対応**: `@storybook/addon-themes` + `data-color-mode` 属性で対応可能

### 代替案: React Cosmos（軽量志向の場合）

テスト機能やドキュメント生成よりも、開発中のコンポーネント確認を軽量・高速に行いたい場合は React Cosmos も選択肢になる。ただし Next.js 16 との互換性を事前に PoC で検証すべき。

## 参考リンク

### Storybook
- [公式サイト](https://storybook.js.org/)
- [GitHub](https://github.com/storybookjs/storybook)
- [Next.js + Vite セットアップ](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite)
- [Panda CSS 連携ガイド](https://panda-css.com/docs/installation/storybook)

### Ladle
- [公式サイト](https://ladle.dev/)
- [GitHub](https://github.com/tajo/ladle)

### React Cosmos
- [公式サイト](https://reactcosmos.org/)
- [GitHub](https://github.com/react-cosmos/react-cosmos)
- [Next.js セットアップ](https://reactcosmos.org/docs/getting-started/next)

### Histoire
- [公式サイト](https://histoire.dev/)
- [GitHub](https://github.com/histoire-dev/histoire)
