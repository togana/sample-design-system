# Panda CSS スタイリング手法の比較

> 調査日: 2026-02-22
> 対象: Panda CSS v1.x のスタイリング API

---

## サマリー

| 観点 | css() 関数 | styled ファクトリ | パターンコンポーネント | cva + styled | sva + createStyleContext |
|------|-----------|-----------------|-------------------|-------------|------------------------|
| **用途** | 汎用スタイリング | JSX 直接スタイリング | レイアウトユーティリティ | バリアント付きコンポーネント | スロット付き複合コンポーネント |
| **戻り値** | className 文字列 | React コンポーネント | className 文字列 / JSX コンポーネント | className 文字列 / JSX コンポーネント | スロットごとの className / JSX コンポーネント |
| **型安全性** | 高（スタイルプロパティの補完） | 高（スタイル + HTML props） | 高（パターン固有の props） | 非常に高（バリアント型推論） | 非常に高（スロット + バリアント型推論） |
| **バリアント対応** | 手動実装が必要 | styled(el, recipe) で対応 | なし | ネイティブ対応 | ネイティブ対応（スロット単位） |
| **バンドルサイズ影響** | 最小 | 中（is-valid-prop 含む） | 小〜中 | 中（全バリアント事前生成） | 中（全バリアント事前生成） |
| **Ark UI 親和性** | 低 | 中 | 低 | 中 | 非常に高 |
| **Park UI 採用** | 不使用 | 単一パーツで使用 | 不使用 | 単一パーツで使用 | 複合コンポーネントで使用 |
| **設定要否** | 不要 | `jsxFramework` 必要 | `jsxFramework` 必要（JSX 版） | 不要（styled 版は `jsxFramework` 必要） | `jsxFramework` 必要 |

---

## 1. 各手法の詳細

### 1.1 css() 関数

Panda CSS の最も基本的なスタイリング方法。スタイルオブジェクトを受け取り、className 文字列を返す。

#### 基本的な使い方

```tsx
import { css } from '../styled-system/css'

function Component() {
  return (
    <div className={css({ display: 'flex', gap: '4', alignItems: 'center' })}>
      <span className={css({ fontWeight: 'bold', color: 'gray.700' })}>
        テキスト
      </span>
    </div>
  )
}
```

#### ショートハンドプロパティ

```tsx
// bg, p, rounded 等のショートハンドが使える
const styles = css({
  bg: 'blue.500',     // backgroundColor
  p: '4',             // padding
  rounded: 'md',      // borderRadius
  mx: 'auto',         // marginInline
})
```

#### スタイル合成

```tsx
// 複数のスタイルオブジェクトをディープマージ
const result = css(
  { mx: '3', paddingTop: '4' },
  { mx: '10', pt: '6' }
)
// 後のオブジェクトが優先 → mx: '10', pt: '6'
```

#### メリット

- **設定不要**: `jsxFramework` の設定なしで使える
- **最小のランタイムコスト**: className 文字列を返すだけで、prop のフィルタリング処理がない
- **柔軟性**: 任意の HTML 要素やサードパーティコンポーネントに適用可能
- **学習コスト低**: CSS を知っていればすぐに使える（camelCase に変換するだけ）
- **RSC 互換**: サーバーコンポーネントでも問題なく使える

#### デメリット

- **冗長な記述**: `className={css({...})}` の繰り返しが多くなる
- **バリアント管理困難**: 手動で条件分岐を書く必要がある
- **スタイルとマークアップの分離**: JSX の中でスタイルの意図が読み取りにくくなる場合がある

---

### 1.2 styled ファクトリ

JSX 要素に直接スタイルプロパティを渡す方法。`jsxFramework` の設定が必要。

#### 前提条件

```ts
// panda.config.ts
export default defineConfig({
  jsxFramework: 'react', // 必須
  // ...
})
```

#### 基本的な使い方

```tsx
import { styled } from '../styled-system/jsx'

// styled.{element} でスタイル props を直接渡す
function Component() {
  return (
    <styled.div display="flex" gap="4" alignItems="center">
      <styled.span fontWeight="bold" color="gray.700">
        テキスト
      </styled.span>
    </styled.div>
  )
}
```

#### ファクトリ関数でのラップ

```tsx
// 外部コンポーネントのラップ
import { MyComponent } from './my-component'
const StyledMyComponent = styled(MyComponent)

// レシピとの組み合わせ
const Button = styled('button', {
  base: { py: '2', px: '4', rounded: 'md' },
  variants: {
    variant: {
      primary: { bg: 'blue.500', color: 'white' },
      secondary: { bg: 'gray.500', color: 'white' },
    },
  },
})
```

#### ファクトリオプション

```tsx
const Button = styled('button', buttonRecipe, {
  // data-recipe 属性を付与（テスト用）
  dataAttr: true,

  // デフォルト props
  defaultProps: { variant: 'secondary', px: '10px' },

  // DOM に渡す props を制御（Framer Motion 等との統合時に有用）
  shouldForwardProp: (prop, variantKeys) =>
    !variantKeys.includes(prop) && !isCssProperty(prop),
})
```

#### jsxStyleProps 設定によるバンドルサイズ制御

```ts
// panda.config.ts
export default defineConfig({
  jsxStyleProps: 'all',     // すべてのスタイル props を許可（デフォルト）
  jsxStyleProps: 'minimal', // css prop のみ許可
  jsxStyleProps: 'none',    // スタイル props なし（styled("div", recipe) のみ使用可能）
})
```

- `'all'` → `'minimal'` / `'none'` に変更すると、`is-valid-prop` の検証コードが不要になり、生成コードのサイズが削減される

#### メリット

- **記述の簡潔さ**: `className={css({...})}` が不要になり、JSX の可読性が向上
- **Chakra UI ライクな DX**: style props に慣れた開発者に馴染みやすい
- **HTML 属性との統合**: style props と HTML props を同じインターフェースで扱える
- **型安全な props**: `HTMLStyledProps<'button'>` 等で HTML 属性 + スタイル props の型を取得可能

#### デメリット

- **生成コードの増加**: `is-valid-prop` によるランタイム検証コードが生成される
- **静的解析の制約**: props の動的リネームができない（Panda はビルド時に静的解析を行うため）
- **設定が必要**: `jsxFramework` の設定と `panda codegen --clean` の実行が必要
- **RSC での注意**: `styled` コンポーネント自体はクライアントコンポーネントとして扱われる場合がある

---

### 1.3 パターンコンポーネント

Panda CSS が提供する定義済みレイアウトプリミティブ。頻出するレイアウトパターンを簡潔に記述できる。

#### 利用可能なパターン一覧

| パターン | 用途 |
|----------|------|
| `Box` | 汎用コンテナ（css 関数相当） |
| `Flex` | フレックスボックスレイアウト |
| `Stack` / `VStack` / `HStack` | 垂直・水平スタック |
| `Grid` / `GridItem` | グリッドレイアウト |
| `Container` | 中央配置の最大幅コンテナ |
| `Center` | フレックスボックスによる中央配置 |
| `Wrap` | 折り返し対応のフレックス |
| `Circle` / `Square` | 固定サイズの図形 |
| `Divider` | 水平・垂直の区切り線 |
| `Float` | 親要素の端に固定配置 |
| `Bleed` | 親のパディングを打ち消す |
| `AspectRatio` | 固定アスペクト比 |
| `VisuallyHidden` | 視覚的に非表示（スクリーンリーダー対応） |
| `LinkOverlay` | クリック領域の拡張 |
| `cq` | コンテナクエリ |

#### 関数形式

```tsx
import { flex, stack, grid } from '../styled-system/patterns'

<div className={flex({ gap: '4', align: 'center' })}>
  <div className={stack({ gap: '2', direction: 'column' })}>
    コンテンツ
  </div>
</div>
```

#### JSX コンポーネント形式

```tsx
import { Flex, Stack, Grid } from '../styled-system/jsx'

<Flex gap="4" align="center">
  <Stack gap="2" direction="column">
    コンテンツ
  </Stack>
</Flex>
```

#### メリット

- **意味の明確化**: `Flex` や `Stack` といった名前がレイアウト意図を明示する
- **定型コードの削減**: `display: 'flex'` + `flexDirection` + `gap` 等をまとめて表現
- **プロパティの絞り込み**: 各パターン固有の props のみが型補完される（`Stack` なら `gap`, `direction`, `align` 等）
- **関数形式との互換**: JSX 版と関数版の両方で使える

#### デメリット

- **学習コスト**: 各パターンの API を覚える必要がある
- **カスタマイズの限界**: 定義済みのパターンを超えた拡張がしにくい
- **styled ファクトリとの重複**: `styled.div` + style props で同等のことが実現可能
- **API 選択肢の増加**: `css()` / `styled` / パターンの使い分けが混在するとコードの一貫性が低下する

---

### 1.4 cva + styled（バリアント付きコンポーネント）

`cva`（Class Variance Authority にインスパイアされた Panda 版）でバリアント定義を行い、`styled` ファクトリでコンポーネント化する。

#### 基本的な使い方

```tsx
import { cva } from '../styled-system/css'
import { styled } from '../styled-system/jsx'

const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'semibold',
    transition: 'colors',
    cursor: 'pointer',
  },
  variants: {
    variant: {
      solid: { bg: 'primary', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'primary', color: 'primary' },
      ghost: { color: 'primary', bg: 'transparent' },
    },
    size: {
      sm: { px: '3', py: '1.5', fontSize: 'sm', rounded: 'sm' },
      md: { px: '4', py: '2', fontSize: 'md', rounded: 'md' },
      lg: { px: '6', py: '3', fontSize: 'lg', rounded: 'lg' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

// styled ファクトリと組み合わせてコンポーネント化
const Button = styled('button', buttonRecipe)
```

#### 型安全なバリアント props

```tsx
import type { RecipeVariantProps } from '../styled-system/css'

type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
// → { variant?: 'solid' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }
```

#### 複合バリアント

```tsx
const buttonRecipe = cva({
  // ...base, variants, defaultVariants は省略
  compoundVariants: [
    {
      variant: 'solid',
      size: 'lg',
      css: { textTransform: 'uppercase', letterSpacing: 'wide' },
    },
  ],
})
```

#### Atomic Recipe (cva) vs Config Recipe (defineRecipe)

| 観点 | Atomic Recipe (cva) | Config Recipe (defineRecipe) |
|------|--------------------|-----------------------------|
| 定義場所 | コンポーネントファイル内（コロケーション） | panda.config.ts の theme.recipes |
| CSS 生成 | 全バリアントを事前生成 | 使用されたバリアントのみ JIT 生成 |
| レスポンシブバリアント | 非対応 | 対応（`{ base: 'sm', md: 'lg' }`） |
| プリセット共有 | 不可 | 可能 |
| クラス名 | アトミック（`bg_blue_500 p_4`） | レシピ名ベース（`button--variant_solid`） |
| バンドルサイズ | バリアント数に比例して増加 | 使用分のみ → 小さい |

#### メリット

- **型安全なバリアント**: `RecipeVariantProps` で自動的に型が推論される
- **コロケーション**: コンポーネントと同じファイルにレシピを定義できる
- **デザインシステムとの親和性**: バリアントによるスタイルの制約がデザインの一貫性を保つ
- **splitVariantProps**: バリアント props と残りの props を安全に分離できる

#### デメリット

- **全バリアント事前生成**: cva は使用有無に関わらず全バリアントの CSS を生成する（Config Recipe で回避可能）
- **レスポンシブバリアント非対応**: cva ではバリアントにレスポンシブ値を渡せない
- **プリセット共有不可**: cva で定義したレシピは外部パッケージとして共有できない

---

### 1.5 sva + createStyleContext（スロット付きコンポーネント）

複数のパーツ（スロット）を持つ複合コンポーネント向けのスタイリング手法。React Context を使ってスロットスタイルを自動配布する。

#### 基本的な使い方

```tsx
'use client'
import { sva } from '../styled-system/css'
import { createStyleContext } from '../styled-system/jsx'

// スロットレシピの定義
const card = sva({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: { borderWidth: '1px', borderColor: 'border', rounded: 'lg', overflow: 'hidden' },
    header: { px: '4', py: '3', borderBottomWidth: '1px', fontWeight: 'semibold' },
    body: { px: '4', py: '4' },
    footer: { px: '4', py: '3', borderTopWidth: '1px' },
  },
  variants: {
    variant: {
      elevated: { root: { shadow: 'md', borderWidth: '0' } },
      outline: { root: { borderWidth: '1px' } },
    },
    size: {
      sm: { header: { px: '3', py: '2', fontSize: 'sm' }, body: { px: '3', py: '3' } },
      md: { header: { px: '4', py: '3', fontSize: 'md' }, body: { px: '4', py: '4' } },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
})

// createStyleContext でスタイルコンテキストを生成
const { withProvider, withContext } = createStyleContext(card)

// withProvider: ルートコンポーネント（バリアント props を受け取り、Context.Provider でスタイルを配布）
export const CardRoot = withProvider('div', 'root')

// withContext: 子コンポーネント（Context からスロットスタイルを自動取得）
export const CardHeader = withContext('div', 'header')
export const CardBody = withContext('div', 'body')
export const CardFooter = withContext('div', 'footer')
```

#### 使用例

```tsx
<CardRoot variant="elevated" size="md">
  <CardHeader>タイトル</CardHeader>
  <CardBody>コンテンツ</CardBody>
  <CardFooter>フッター</CardFooter>
</CardRoot>
```

#### Ark UI との統合（Park UI パターン）

Park UI では、Ark UI のヘッドレスコンポーネントを `withProvider` / `withContext` でラップしてスタイルを付与するパターンを採用している。

```tsx
'use client'
import { Accordion } from '@ark-ui/react/accordion'
import { ark } from '@ark-ui/react/factory'
import { createStyleContext } from 'styled-system/jsx'
import { accordion } from 'styled-system/recipes'

const { withProvider, withContext } = createStyleContext(accordion)

export const Root = withProvider(Accordion.Root, 'root')
export const Item = withContext(Accordion.Item, 'item')
export const ItemTrigger = withContext(Accordion.ItemTrigger, 'itemTrigger')
export const ItemContent = withContext(Accordion.ItemContent, 'itemContent')
export const ItemIndicator = withContext(Accordion.ItemIndicator, 'itemIndicator', {
  defaultProps: { children: <ChevronDownIcon /> },
})
```

#### 単一パーツコンポーネントの場合（styled + Ark UI）

Park UI のボタンのような単一パーツコンポーネントでは `sva` ではなく `styled` ファクトリを直接使用する。

```tsx
import { ark } from '@ark-ui/react/factory'
import { styled } from 'styled-system/jsx'
import { button } from 'styled-system/recipes'

const BaseButton = styled(ark.button, button)
```

#### createStyleContext の内部動作

```
withProvider(Component, slotName)
  ├─ splitVariantProps(props) でバリアント props を分離
  ├─ recipe(variantProps) でスロットごとのスタイルを計算
  ├─ StyleContext.Provider で計算済みスタイルを配布
  └─ Component に styles[slotName] を className として適用

withContext(Component, slotName)
  ├─ useContext(StyleContext) で親からスタイルを取得
  └─ Component に styles[slotName] を className として適用
```

#### Atomic Slot Recipe (sva) vs Config Slot Recipe (defineSlotRecipe)

cva と同様の違いがある。

| 観点 | sva | defineSlotRecipe |
|------|-----|-----------------|
| 定義場所 | コンポーネントファイル内 | panda.config.ts の theme.slotRecipes |
| CSS 生成 | 全バリアント事前生成 | 使用分のみ JIT 生成 |
| Anatomy 対応 | 手動でスロット定義 | `@ark-ui/anatomy` と連携可能 |
| プリセット共有 | 不可 | 可能（Park UI はこちらを採用） |

#### メリット

- **Ark UI との高い親和性**: ヘッドレスコンポーネントの各パーツにスロットスタイルを自動適用
- **バリアント props の自動伝播**: ルートで指定したバリアントが全スロットに反映される
- **css() 関数不要**: `createStyleContext` を使えば手動でのクラス名適用が不要
- **関心の分離**: アクセシビリティ・インタラクション（Ark UI）とスタイル（Panda CSS）が明確に分離される
- **splitVariantProps**: バリアント props と HTML props を型安全に分離

#### デメリット

- **React Context 依存**: `'use client'` ディレクティブが必要（Next.js App Router の場合）
- **全バリアント事前生成**: sva は全バリアントの CSS を生成する（defineSlotRecipe で回避可能）
- **学習コスト**: `withProvider` / `withContext` のパターンを理解する必要がある
- **デバッグの難しさ**: Context を介したスタイル配布のため、スタイルの適用元を追跡しにくい場合がある

---

## 2. 型安全性の比較

### 2.1 基本的な型安全性

すべての手法に共通して、Panda CSS は以下の型安全性を提供する。

- **プロパティ名の補完**: CSS プロパティ名（camelCase）の自動補完
- **トークン値の補完**: `colors`, `spacing`, `radii` 等のトークン値の候補表示
- **ショートハンド対応**: `bg`, `p`, `rounded` 等のショートハンドプロパティも型付き

### 2.2 strictTokens / strictPropertyValues

```ts
// panda.config.ts
export default defineConfig({
  strictTokens: true,          // トークンが定義されたプロパティでは、トークン値のみ許可
  strictPropertyValues: true,  // トークン未定義のプロパティでも、有効な CSS 値のみ許可
})
```

- `strictTokens: true` の場合、`bg: 'red'` のような生の CSS 値はエラーになる（`bg: 'red.500'` のようにトークン値を使う）
- エスケープハッチ: `bg: '[#ff0000]'` のように角括弧で囲むことで任意の値を使用可能

### 2.3 手法別の型安全性

| 手法 | スタイル型安全性 | バリアント型安全性 | HTML 属性型安全性 |
|------|----------------|------------------|-----------------|
| css() | あり（CSSProperties 型） | なし | なし（className 文字列を返すのみ） |
| styled ファクトリ | あり | あり（inline recipe の場合） | あり（HTMLStyledProps<'el'>） |
| パターン | あり（パターン固有の型） | なし | あり（JSX 版のみ） |
| cva + styled | あり | あり（RecipeVariantProps） | あり（HTMLStyledProps<'el'> + RecipeVariantProps） |
| sva + createStyleContext | あり | あり（RecipeVariantProps） | あり（withProvider/withContext 経由） |

### 2.4 RecipeVariantProps の活用

```tsx
import { cva } from '../styled-system/css'
import type { RecipeVariantProps } from '../styled-system/css'

const buttonRecipe = cva({
  variants: {
    variant: { solid: {}, outline: {} },
    size: { sm: {}, md: {}, lg: {} },
  },
})

type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
// → { variant?: 'solid' | 'outline', size?: 'sm' | 'md' | 'lg' }

// コンポーネントの props に型安全にバリアントを含められる
type ButtonProps = ButtonVariants & React.ButtonHTMLAttributes<HTMLButtonElement>
```

---

## 3. Ark UI / Park UI での採用状況

### 3.1 Park UI のアーキテクチャ

Park UI は Ark UI（ヘッドレス UI コンポーネント）+ Panda CSS のスタイリングで構成されるデザインシステムで、React, Vue, Solid を含む複数のフレームワークに対応している。

#### コンポーネントの分類と採用パターン

| コンポーネント種別 | 使用パターン | 例 |
|------------------|------------|-----|
| 単一パーツ | `styled(ark.element, recipe)` | Button, Badge, Code |
| 複合パーツ（マルチスロット） | `sva/defineSlotRecipe` + `createStyleContext` | Accordion, Dialog, Select, Table |

#### 単一パーツの実装例（Button）

```tsx
import { ark } from '@ark-ui/react/factory'
import { styled } from 'styled-system/jsx'
import { button } from 'styled-system/recipes'

const BaseButton = styled(ark.button, button)
```

- `ark.button`: Ark UI のベース要素（アクセシビリティ対応済み）
- `button`: Panda CSS の Config Recipe（`defineRecipe` で定義、プリセット経由で配布）
- `styled()`: 両者を結合してスタイル付きコンポーネントを生成

#### 複合パーツの実装例（Accordion）

```tsx
import { Accordion } from '@ark-ui/react/accordion'
import { createStyleContext } from 'styled-system/jsx'
import { accordion } from 'styled-system/recipes'

const { withProvider, withContext } = createStyleContext(accordion)

export const Root = withProvider(Accordion.Root, 'root')
export const Item = withContext(Accordion.Item, 'item')
export const ItemTrigger = withContext(Accordion.ItemTrigger, 'itemTrigger')
export const ItemContent = withContext(Accordion.ItemContent, 'itemContent')
```

### 3.2 Park UI のレシピ配布方式

- Park UI v0.44 以降、`@park-ui/panda-preset` にはコンポーネントレシピが含まれなくなった
- レシピはコンポーネントのソースコードとともにプロジェクトにコピーして使う方式を採用
- Park UI CLI (`npx @park-ui/cli add <component>`) でコンポーネントとレシピを一括取得可能

### 3.3 Ark UI のスタイリングガイドライン

Ark UI 公式が推奨するスタイリングアプローチ:

1. **Panda CSS + Slot Recipe**: `defineSlotRecipe` で各パーツのスタイルを定義
2. **`@ark-ui/anatomy`**: コンポーネントの anatomy オブジェクトからスロット名を取得
3. **data 属性ターゲティング**: `data-part` 属性を使ったセレクタベースのスタイリングも可能

```tsx
import { accordionAnatomy } from '@ark-ui/anatomy'

const accordion = defineSlotRecipe({
  className: 'accordion',
  slots: accordionAnatomy.keys(),
  // ...
})
```

---

## 4. 移行時の注意点（css() → styled）

### 4.1 設定変更

```ts
// panda.config.ts に追加
export default defineConfig({
  jsxFramework: 'react',  // 必須
  // ...
})
```

設定変更後、`panda codegen --clean` を実行して `styled-system/` を再生成する。

### 4.2 段階的な移行手順

1. **jsxFramework の設定**: まず設定を追加して codegen を実行
2. **新規コンポーネントから適用**: 新しく作成するコンポーネントで styled ファクトリを使用
3. **既存コンポーネントの段階的移行**: 修正のタイミングで css() から styled に変換
4. **パターンの統一**: css() / styled / パターンが混在しないようルールを決める

### 4.3 変換パターン

#### 基本スタイリング

```tsx
// Before: css() 関数
<div className={css({ display: 'flex', gap: '4', p: '4' })}>
  <span className={css({ fontWeight: 'bold' })}>テキスト</span>
</div>

// After: styled ファクトリ
<styled.div display="flex" gap="4" p="4">
  <styled.span fontWeight="bold">テキスト</styled.span>
</styled.div>
```

#### バリアント付きコンポーネント

```tsx
// Before: css() + 手動条件分岐
function Button({ variant, size, children }) {
  return (
    <button className={css({
      px: size === 'sm' ? '3' : '4',
      bg: variant === 'primary' ? 'blue.500' : 'gray.500',
    })}>
      {children}
    </button>
  )
}

// After: cva + styled
const buttonRecipe = cva({
  variants: {
    variant: { primary: { bg: 'blue.500' }, secondary: { bg: 'gray.500' } },
    size: { sm: { px: '3' }, md: { px: '4' } },
  },
})
const Button = styled('button', buttonRecipe)
```

#### スロット付きコンポーネント

```tsx
// Before: css() + 手動クラス適用
function Card({ children }) {
  const styles = card({ variant: 'outline' })
  return (
    <div className={styles.root}>
      <div className={styles.header}>ヘッダー</div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

// After: sva + createStyleContext
const { withProvider, withContext } = createStyleContext(card)
const CardRoot = withProvider('div', 'root')
const CardHeader = withContext('div', 'header')
const CardBody = withContext('div', 'body')

// 使用側
<CardRoot variant="outline">
  <CardHeader>ヘッダー</CardHeader>
  <CardBody>{children}</CardBody>
</CardRoot>
```

### 4.4 注意事項

1. **静的解析の制約**: `styled` コンポーネントの props は静的に解析されるため、動的な prop 名は使用できない
   ```tsx
   // NG: 動的なプロパティ名
   const prop = 'bg'
   <styled.div {...{[prop]: 'red.500'}} />

   // OK: 直接プロパティ名を指定
   <styled.div bg="red.500" />
   ```

2. **RSC との互換性**: `createStyleContext` は React Context を使用するため、`'use client'` ディレクティブが必要
3. **生成コードのサイズ**: styled ファクトリを有効にすると `styled-system/` の生成コードが増加する。`jsxStyleProps: 'minimal'` で緩和可能
4. **サードパーティとの統合**: Framer Motion 等を使う場合は `shouldForwardProp` の設定が必要
5. **テスト**: `dataAttr: true` を設定すると `data-recipe` 属性が付与され、テストセレクタとして利用可能

---

## 5. 推奨パターン

### 5.1 デザインシステム構築における推奨

本プロジェクト（ADR-006 で決定済み）では、以下のパターンに統一する。

| パターン | 手法 | 使用場面 |
|----------|------|---------|
| 基本スタイリング | `styled.div`, `styled.button` 等 | レイアウト、ワンオフのスタイリング |
| バリアント付きコンポーネント | `cva` + `styled("element", recipe)` | Button, Badge, Input 等の単一パーツコンポーネント |
| スロット付きコンポーネント | `sva` + `createStyleContext` | Card, Accordion, Dialog 等の複合コンポーネント |

### 5.2 使わないもの

| 手法 | 理由 |
|------|------|
| `css()` 関数 | styled ファクトリで同等のことが実現でき、スタイリング手法を統一するため |
| パターンコンポーネント（Box, Flex, Stack 等） | styled ファクトリで代替可能であり、API の選択肢を絞ることで一貫性を保つため |

### 5.3 Config Recipe vs Atomic Recipe の選択基準

| 状況 | 推奨 |
|------|------|
| デザインシステムのコアコンポーネント | Config Recipe（defineRecipe / defineSlotRecipe）→ JIT 生成でバンドルサイズ最適化 |
| アプリケーション固有のコンポーネント | Atomic Recipe（cva / sva）→ コロケーションによる開発効率 |
| プリセットとして外部配布 | Config Recipe（defineRecipe / defineSlotRecipe）のみ対応 |

### 5.4 jsxStyleProps の選択基準

| 設定 | 推奨場面 |
|------|---------|
| `'all'`（デフォルト） | 開発初期、Chakra UI からの移行時、DX 重視の場合 |
| `'minimal'` | バンドルサイズを気にする場合。`css` prop のみ許可し、ランタイム検証を削減 |
| `'none'` | styled(el, recipe) のみ使う場合。最もバンドルサイズが小さい |

---

## 参考資料

- [Panda CSS - Writing Styles](https://panda-css.com/docs/concepts/writing-styles) - css() 関数の公式ドキュメント
- [Panda CSS - Style Props](https://panda-css.com/docs/concepts/style-props) - styled ファクトリと JSX style props の公式ドキュメント
- [Panda CSS - Patterns](https://panda-css.com/docs/concepts/patterns) - パターンコンポーネントの公式ドキュメント
- [Panda CSS - Recipes](https://panda-css.com/docs/concepts/recipes) - cva / defineRecipe の公式ドキュメント
- [Panda CSS - Slot Recipes](https://panda-css.com/docs/concepts/slot-recipes) - sva / defineSlotRecipe / createStyleContext の公式ドキュメント
- [Panda CSS - FAQ](https://panda-css.com/docs/overview/faq) - バンドルサイズ・パフォーマンスの FAQ
- [Panda CSS - Component Library Guide](https://panda-css.com/docs/guides/component-library) - コンポーネントライブラリでの使い方
- [Panda CSS - Migration from Styled Components](https://panda-css.com/docs/migration/styled-components) - 移行ガイド
- [Why would I choose Panda CSS?](https://www.astahmer.dev/posts/why-would-i-choose-panda-css) - Panda CSS メンテナーによる解説
- [Styling Ark UI Tabs with Panda CSS](https://www.adebayosegun.com/blog/styling-ark-ui-tabs-with-panda-css) - Ark UI + Panda CSS の統合例
- [Park UI](https://park-ui.com/) - Ark UI + Panda CSS のデザインシステム
- [Park UI - GitHub](https://github.com/cschroeter/park-ui) - Park UI のソースコード
- [Reduce the size of generated styled system - GitHub Issue #1106](https://github.com/chakra-ui/panda/issues/1106) - バンドルサイズ最適化の議論
