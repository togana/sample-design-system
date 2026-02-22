# カラートークン構造の比較: Polaris / Chakra UI / Park UI

> 調査日: 2026-02-22
> 対象: Shopify Polaris (v13+), Chakra UI (v3), Park UI (v1 / @park-ui/preset)

---

## サマリー

| 観点 | Shopify Polaris | Chakra UI v3 | Park UI |
|------|----------------|-------------|---------|
| トークン階層 | 2層（パレット → セマンティック） | 2層（プリミティブ → セマンティック） | 3層（プリミティブ → カラースケール → バリアント） |
| プリミティブの単位 | 16段階スケール（HSLuv） | 11段階スケール（50–950） | 12段階スケール（Radix Colors） |
| セマンティックの分類軸 | 要素種別 × ロール × 状態 | グローバル用途 + パレット別用途 | グローバル用途 + コンポーネントバリアント |
| ダークモード方式 | CSS クラス切替（値の再マッピング） | CSS クラス切替（`_light` / `_dark`） | CSS 条件セレクター（Radix の light/dark ペア） |
| Panda CSS 対応 | 公式プリセットなし（手動マッピング） | 公式には未使用（API は類似） | 公式プリセットあり（ネイティブ対応） |

---

## 1. 命名規約（プリミティブ / セマンティックの分け方）

### 1.1 Shopify Polaris

**プリミティブトークン（非公開・内部利用のみ）**

HSLuv 色空間に基づく 16段階スケール。12色相 + 2アルファパレット。消費者には公開されない。

```
gray[1] = rgba(255, 255, 255, 1)     // 最も明るい
gray[8] = rgba(227, 227, 227, 1)     // 中間
gray[16] = rgba(26, 26, 26, 1)       // 最も暗い
blue[12] = rgba(0, 113, 233, 1)      // ブランドブルー
red[12] = rgba(199, 10, 36, 1)       // クリティカル
```

色相一覧: gray, blue, azure, cyan, green, lime, magenta, orange, purple, rose, teal, yellow, blackAlpha, whiteAlpha

**セマンティックトークン（公開 API）**

命名式: `--p-color-[要素]-[ロール]-[強調度]-[状態]`

```
--p-color-bg                         // ページ背景
--p-color-bg-surface                  // カード・パネル
--p-color-bg-surface-hover            // カード（ホバー）
--p-color-bg-surface-critical         // エラー背景
--p-color-bg-fill                     // ボタン等の塗り
--p-color-bg-fill-brand               // ブランドカラーの塗り
--p-color-text                        // プライマリテキスト
--p-color-text-secondary              // サブテキスト
--p-color-text-critical               // エラーテキスト
--p-color-border                      // ボーダー
--p-color-border-focus                // フォーカスリング
--p-color-icon                        // アイコン
--p-color-icon-success                // 成功アイコン
```

ロール一覧（13種）: default, brand, info, success, caution, warning, critical, magic, emphasis, transparent, inverse, input, nav

**特徴**: 要素種別（bg/text/border/icon）とロール（success/critical 等）の直積で命名する。`bg-surface`（大面積）と `bg-fill`（小面積）を明示的に区別する。

---

### 1.2 Chakra UI v3

**プリミティブトークン**

11段階スケール（50, 100, 200, ..., 900, 950）。10色相パレット。

```ts
colors: {
  gray:  { 50: '#fafafa', 100: '#f4f4f5', ..., 950: '#111111' },
  blue:  { 50: '#eff6ff', ..., 950: '#172554' },
  red:   { 50: '#fef2f2', ..., 950: '#450a0a' },
  // + orange, yellow, green, teal, cyan, purple, pink
  // + black, white, whiteAlpha, blackAlpha
}
```

**セマンティックトークン — グローバル**

用途ベースで `bg` / `fg` / `border` に分類。

```ts
bg.DEFAULT        // ページ背景（light: white, dark: black）
bg.subtle         // 控えめな背景
bg.muted          // 弱い背景
bg.emphasized     // 強調背景
bg.inverted       // 反転背景
bg.error          // エラー背景
fg.DEFAULT        // プライマリテキスト
fg.muted          // 弱いテキスト
fg.error          // エラーテキスト
border.DEFAULT    // 標準ボーダー
border.error      // エラーボーダー
```

**セマンティックトークン — パレット別（各色 × 8トークン）**

```ts
blue.contrast     // solid 背景上のテキスト色
blue.fg           // テキスト / アイコン色
blue.subtle       // 控えめな背景
blue.muted        // 弱い背景
blue.emphasized   // 強調背景
blue.solid        // ボタン等の塗り
blue.focusRing    // フォーカスリング
blue.border       // ボーダー
```

**特徴**: グローバルトークン（`bg.muted`）は UI要素の「強調度」で命名し、パレット別トークン（`blue.solid`）は「用途」で命名する二重構造。

---

### 1.3 Park UI

**プリミティブトークン（最小限）**

black / white とそのアルファバリアント（a1–a12）のみ。

```ts
tokens: {
  colors: {
    black: { DEFAULT: '#000000', a1: 'rgba(0,0,0,0.05)', ..., a12: 'rgba(0,0,0,0.95)' },
    white: { DEFAULT: '#ffffff', a1: 'rgba(255,255,255,0.05)', ..., a12: 'rgba(255,255,255,0.95)' },
  }
}
```

**カラースケール（セマンティックトークンとして定義）**

Radix Colors の 12段階スケール。各ステップに意味がある。32色相すべてをセマンティックトークンとして定義。

```ts
amber.1   // アプリ背景
amber.2   // 控えめな背景
amber.3   // UI要素の背景
amber.4   // ホバー時の UI要素背景
amber.5   // アクティブ / 選択時の UI要素背景
amber.6   // 控えめなボーダー
amber.7   // UI要素のボーダー / フォーカスリング
amber.8   // ホバー時のボーダー
amber.9   // ソリッド背景（ブランドカラー）
amber.10  // ホバー時のソリッド背景
amber.11  // 低コントラストテキスト
amber.12  // 高コントラストテキスト
amber.a1–a12  // 各ステップのアルファバリアント
```

**コンポーネントバリアントトークン（5種）**

各色に `solid` / `subtle` / `surface` / `outline` / `plain` の 5バリアントが付属。

```ts
amber.solid.bg         // ソリッドボタン背景
amber.solid.bg.hover   // ソリッドボタン背景（ホバー）
amber.solid.fg         // ソリッドボタン前景色
amber.subtle.bg        // 控えめなボタン背景
amber.subtle.fg        // 控えめなボタン前景色
amber.surface.bg       // サーフェス背景
amber.surface.border   // サーフェスボーダー
amber.outline.border   // アウトラインボーダー
amber.plain.fg         // プレーンテキスト
```

**グローバルセマンティックトークン（少数）**

```ts
fg.default   // デフォルトテキスト → gray.12
fg.muted     // 控えめなテキスト → gray.11
fg.subtle    // さらに控えめ → gray.10
canvas       // ページ背景 → gray.1
border       // デフォルトボーダー → gray.4
error        // エラー → red.9
```

**特徴**: Radix Colors のスケール番号自体にセマンティクスが埋め込まれている（1=背景, 9=ソリッド等）。コンポーネントバリアントが色ごとに定義されるため、`colorPalette` の切替だけでテーマが変わる。

---

## 2. ダークモード対応の方法

### 比較表

| 項目 | Shopify Polaris | Chakra UI v3 | Park UI |
|------|----------------|-------------|---------|
| 切替メカニズム | CSS クラス（`.p-theme-dark`） | CSS クラス（`.dark`） | CSS セレクター（`[data-color-mode=dark]` or `.dark`） |
| CSS 変数 | `:root` に全定義 → dark クラスで上書き | `:root, .light` に定義 → `.dark` で上書き | Panda CSS が条件別に生成 |
| トークン定義方法 | base テーマ + dark パーシャルオーバーライド | `{ _light: '...', _dark: '...' }` | `{ _light: '...', _dark: '...' }` |
| 値の決め方 | スケール位置を手動で反転 | スケール位置をミラーリング（50↔950） | Radix Colors が light/dark ペアを提供 |
| プリミティブの変更 | なし（セマンティックの参照先が変わる） | なし（同上） | スケール値自体が light/dark で異なる |
| 高コントラストモード | あり（experimental） | なし | なし（Radix Colors の設計で一定のコントラスト保証） |
| React API | `<AppProvider colorScheme="dark">` | `next-themes` 連携 | `data-color-mode` 属性 |

### 各システムの CSS 出力例

**Polaris**
```css
:root, .p-theme-light {
  --p-color-bg: rgba(246, 246, 247, 1);
  --p-color-bg-surface: rgba(255, 255, 255, 1);
  --p-color-text: rgba(32, 34, 35, 1);
}
.p-theme-dark {
  --p-color-bg: rgba(26, 26, 26, 1);
  --p-color-bg-surface: rgba(46, 46, 46, 1);
  --p-color-text: rgba(227, 227, 227, 1);
}
```

**Chakra UI v3**
```css
:root, .light {
  --chakra-colors-bg: var(--chakra-colors-white);
  --chakra-colors-fg: var(--chakra-colors-black);
  --chakra-colors-blue-solid: var(--chakra-colors-blue-600);
}
.dark {
  --chakra-colors-bg: var(--chakra-colors-black);
  --chakra-colors-fg: var(--chakra-colors-gray-50);
  --chakra-colors-blue-solid: var(--chakra-colors-blue-600);
}
```

**Park UI（Panda CSS 経由）**
```css
:root, .light {
  --colors-amber-9: #ffc53d;
  --colors-amber-solid-bg: var(--colors-amber-9);
}
[data-color-mode=dark], .dark {
  --colors-amber-9: #ffc53d;  /* Radix は step 9 は同値の場合もある */
  --colors-amber-1: #16120c;  /* step 1 は light/dark で大きく異なる */
}
```

---

## 3. Panda CSS での実装パターン

### 3.1 Shopify Polaris → Panda CSS（手動マッピング）

公式の Panda CSS プリセットは存在しない。手動で実装する場合のパターン:

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  prefix: 'p',
  conditions: {
    light: '[data-theme=light] &, :root &',
    dark:  '[data-theme=dark] &',
  },
  theme: {
    extend: {
      // プリミティブ（非公開扱い）
      tokens: {
        colors: {
          gray:  { 1: { value: 'rgba(255,255,255,1)' }, /* ...16段階 */ },
          blue:  { 1: { value: 'rgba(252,253,255,1)' }, /* ...16段階 */ },
          red:   { 1: { value: 'rgba(255,250,251,1)' }, /* ...16段階 */ },
        },
      },
      // セマンティック
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: {
              value: { base: '{colors.gray.3}', _dark: '{colors.gray.16}' },
            },
            surface: {
              DEFAULT: {
                value: { base: '{colors.gray.1}', _dark: '{colors.gray.15}' },
              },
              hover: {
                value: { base: '{colors.gray.3}', _dark: '{colors.gray.14}' },
              },
              critical: {
                value: { base: '{colors.red.3}', _dark: '{colors.red.15}' },
              },
            },
            fill: {
              DEFAULT: {
                value: { base: '{colors.gray.14}', _dark: '{colors.gray.8}' },
              },
              brand: {
                value: { base: '{colors.gray.16}', _dark: '{colors.gray.1}' },
              },
            },
          },
          text: {
            DEFAULT: {
              value: { base: '{colors.gray.14}', _dark: '{colors.gray.8}' },
            },
            secondary: {
              value: { base: '{colors.gray.11}', _dark: '{colors.gray.10}' },
            },
            critical: {
              value: { base: '{colors.red.12}', _dark: '{colors.red.9}' },
            },
          },
        },
      },
    },
  },
})
```

### 3.2 Chakra UI v3 → Panda CSS

Chakra UI v3 は内部的に Panda CSS を使用していないが、API 設計は Panda CSS と同じチーム（Segun Adebayo）による。トークン構文がほぼ同一。

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  conditions: {
    light: ':root &, .light &',
    dark:  '.dark &',
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          gray: {
            50:  { value: '#fafafa' },
            100: { value: '#f4f4f5' },
            // ...
            900: { value: '#18181b' },
            950: { value: '#111111' },
          },
          blue: { /* 50–950 */ },
          // ...10パレット
        },
      },
      semanticTokens: {
        colors: {
          // グローバルトークン
          bg: {
            DEFAULT:    { value: { base: '{colors.white}',    _dark: '{colors.black}' } },
            subtle:     { value: { base: '{colors.gray.50}',  _dark: '{colors.gray.950}' } },
            muted:      { value: { base: '{colors.gray.100}', _dark: '{colors.gray.900}' } },
          },
          fg: {
            DEFAULT:    { value: { base: '{colors.black}',     _dark: '{colors.gray.50}' } },
            muted:      { value: { base: '{colors.gray.600}',  _dark: '{colors.gray.400}' } },
          },
          // パレット別トークン
          blue: {
            solid:      { value: { base: '{colors.blue.600}',  _dark: '{colors.blue.600}' } },
            fg:         { value: { base: '{colors.blue.700}',  _dark: '{colors.blue.300}' } },
            subtle:     { value: { base: '{colors.blue.100}',  _dark: '{colors.blue.900}' } },
          },
        },
      },
    },
  },
})
```

### 3.3 Park UI → Panda CSS（公式プリセット）

Park UI は Panda CSS ネイティブ。`@park-ui/preset` をインストールするだけで利用可能。

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev'
import { preset, plugin } from '@park-ui/preset'

export default defineConfig({
  presets: [preset],
  plugins: [plugin],      // デフォルトの Panda カラーを Radix Colors で置換
  theme: {
    extend: {
      // 必要に応じてカスタマイズ
    },
  },
})
```

**コンポーネントでの使用（colorPalette パターン）**

```tsx
// Park UI のボタンレシピ（抜粋）
const button = defineRecipe({
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.solid.bg',
        color: 'colorPalette.solid.fg',
        _hover: { bg: 'colorPalette.solid.bg.hover' },
      },
      subtle: {
        bg: 'colorPalette.subtle.bg',
        color: 'colorPalette.subtle.fg',
        _hover: { bg: 'colorPalette.subtle.bg.hover' },
      },
      outline: {
        borderColor: 'colorPalette.outline.border',
        color: 'colorPalette.outline.fg',
        _hover: { bg: 'colorPalette.outline.bg.hover' },
      },
    },
  },
})

// JSX での使用
<Button colorPalette="amber" variant="solid">保存</Button>
<Button colorPalette="red" variant="outline">削除</Button>
```

**トークン解決チェーン**

```
JSX: <Button colorPalette="amber" variant="solid" />
  ↓ レシピ: bg: 'colorPalette.solid.bg'
  ↓ セマンティック: colors.amber.solid.bg → { _light: '{colors.amber.9}', _dark: '{colors.amber.9}' }
  ↓ スケール: colors.amber.9 → { _light: '#ffc53d', _dark: '#ffc53d' }
  ↓ CSS: --colors-amber-solid-bg: var(--colors-amber-9);
```

---

## 4. 設計判断に向けた考察

### トークン階層の選択

| アプローチ | 採用システム | メリット | デメリット |
|-----------|------------|---------|-----------|
| 2層（パレット→セマンティック） | Polaris, Chakra UI | シンプルで理解しやすい | コンポーネントバリアント定義が分散する |
| 3層（パレット→スケール→バリアント） | Park UI | colorPalette でバリアント切替が容易 | トークン総数が多い |

### ダークモードの設計方針

| アプローチ | 採用システム | メリット | デメリット |
|-----------|------------|---------|-----------|
| 手動でスケール反転 | Polaris, Chakra UI | 完全なコントロール | 全トークンの dark 値を手動管理 |
| Radix Colors の light/dark ペア | Park UI | コントラスト・アクセシビリティが保証済み | カスタムパレット追加時に Radix 準拠が必要 |

### Panda CSS との親和性

| システム | Panda CSS 親和性 | 備考 |
|---------|-----------------|------|
| Polaris | 低 | 公式プリセットなし。16段階スケール→手動変換が必要 |
| Chakra UI | 中 | API 設計が類似（同じ作者）。コピーで移植可能 |
| Park UI | **高** | Panda CSS ネイティブ。`@park-ui/preset` をそのまま利用可能 |

---

## 参考リンク

### Shopify Polaris
- [Polaris カラートークン](https://polaris.shopify.com/tokens/color)
- [Polaris パレットとロール](https://polaris.shopify.com/design/colors/palettes-and-roles)
- [polaris-tokens GitHub](https://github.com/Shopify/polaris)

### Chakra UI
- [Chakra UI セマンティックトークン](https://chakra-ui.com/docs/theming/semantic-tokens)
- [Chakra UI カラー](https://chakra-ui.com/docs/theming/colors)
- [Chakra UI ダークモード](https://chakra-ui.com/docs/styling/dark-mode)
- [Chakra UI GitHub](https://github.com/chakra-ui/chakra-ui)

### Park UI
- [Park UI テーマカスタマイズ](https://park-ui.com/docs/theme/customize)
- [Park UI セマンティックトークン](https://park-ui.com/docs/theme/semantic-tokens)
- [Park UI GitHub](https://github.com/cschroeter/park-ui)

### Panda CSS
- [Panda CSS トークン](https://panda-css.com/docs/theming/tokens)
- [Panda CSS セマンティックトークン](https://panda-css.com/docs/theming/semantic-tokens)
- [Panda CSS 複数テーマ](https://panda-css.com/docs/guides/multiple-themes)
- [Panda CSS Virtual Color](https://panda-css.com/docs/concepts/virtual-color)
