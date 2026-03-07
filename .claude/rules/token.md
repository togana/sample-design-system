# トークン命名規約

## 2層構造

| 層 | 役割 | 命名パターン | 例 |
|---|---|---|---|
| プリミティブ | 生の値 | `{色相}.{スケール番号}` | `gray.100`, `blue.600` |
| セマンティック | 用途ベース | `{ロール}.{バリエーション}` | `primary.DEFAULT`, `surface.on` |

## プリミティブトークン

- 10段階スケール: `100, 200, 300, 400, 500, 600, 700, 800, 900, 1000`
- 値は Serendie Design System のカラーパレットから流用する

## セマンティックカラーのロール体系

Impression / Component / Interaction の3区分で整理する。

### Impression（印象）

`primary`, `secondary`, `tertiary`, `positive`, `negative`, `notice`

バリエーション: `DEFAULT`, `on`, `container`, `onContainer`（positive / negative / notice は追加で `containerVariant`, `onContainerVariant`）

### Component（構成）

- **Surface**: `DEFAULT`, `on`, `onVariant`, `dim`, `bright`, `container`, `containerBright`, `containerDim`, `inverse`, `inverseOn`, `inversePrimary`
- **Outline**: `DEFAULT`, `bright`, `dim`
- **Scrim**: 半透明オーバーレイ

### Interaction（インタラクション）

- **hovered**: `DEFAULT`, `variant`, `onPrimary`
- **selected**: `DEFAULT`, `surface`
- **disabled**: `DEFAULT`, `onSurface`

## セマンティックトークンの命名式

```
{カテゴリ}.{ロール}.{バリエーション}
```

最大深度: 4階層まで

## 禁止パターン

- モード名を含めない（`darkBg`, `lightText`）
- 特定コンポーネント名を含めない（`primary.buttonHeader`）
- 生の値を含めない（`primary.#3B86F9`）
- プリミティブ参照を含めない（`primary.blue600`）
- 5階層以上にしない

## ダークモード

Panda CSS の `conditions` で `_dark` を定義し、セマンティックトークンの `value` 内で `base` / `_dark` を切り替える。

```ts
conditions: {
  light: "[data-color-mode=light] &",
  dark: "[data-color-mode=dark] &",
}
```

## アクセシビリティ基準

- テキストに使用するカラートークンは APCA **Lc 75以上** を使用する
- 大きなテキスト（18px bold / 24px 以上）は Lc 60以上を許容する
- 装飾的な要素には基準を適用しない
