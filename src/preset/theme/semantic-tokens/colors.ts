import { defineSemanticTokens } from "@pandacss/dev";

/**
 * セマンティックカラートークン
 * ロール体系: Impression / Component / Interaction の3区分
 * 値のマッピングは Serendie Design System (konjo / konjo-dark テーマ) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/color.konjo.json
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/color.konjo-dark.json
 */
export const colors = defineSemanticTokens.colors({
  // ============================================================
  // Impression（印象）— ブランドやUIの印象を形作るロール
  // ============================================================

  primary: {
    DEFAULT: {
      value: { base: "{colors.blue.700}", _dark: "{colors.blue.300}" },
    },
    on: {
      value: { base: "{colors.white}", _dark: "{colors.black}" },
    },
    container: {
      value: { base: "{colors.blue.700}", _dark: "{colors.blue.300}" },
    },
    onContainer: {
      value: { base: "{colors.white}", _dark: "{colors.black}" },
    },
  },

  secondary: {
    DEFAULT: {
      value: { base: "{colors.blue.300}", _dark: "{colors.blue.800}" },
    },
    on: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
    container: {
      value: { base: "{colors.blue.300}", _dark: "{colors.blue.800}" },
    },
    onContainer: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
  },

  tertiary: {
    DEFAULT: {
      value: { base: "{colors.blue.100}", _dark: "{colors.blue.1000}" },
    },
    on: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
    container: {
      value: { base: "{colors.blue.100}", _dark: "{colors.blue.1000}" },
    },
    onContainer: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
  },

  positive: {
    DEFAULT: {
      value: { base: "{colors.green.500}", _dark: "{colors.green.500}" },
    },
    on: {
      value: { base: "{colors.white}", _dark: "{colors.white}" },
    },
    container: {
      value: { base: "{colors.green.200}", _dark: "{colors.green.700}" },
    },
    onContainer: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
    containerVariant: {
      value: { base: "{colors.green.100}", _dark: "{colors.green.900}" },
    },
    onContainerVariant: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
  },

  negative: {
    DEFAULT: {
      value: { base: "{colors.red.600}", _dark: "{colors.red.300}" },
    },
    on: {
      value: { base: "{colors.white}", _dark: "{colors.black}" },
    },
    container: {
      value: { base: "{colors.red.200}", _dark: "{colors.red.800}" },
    },
    onContainer: {
      value: { base: "{colors.black}", _dark: "{colors.white}" },
    },
    containerVariant: {
      value: { base: "{colors.red.100}", _dark: "{colors.red.900}" },
    },
    onContainerVariant: {
      value: { base: "{colors.red.700}", _dark: "{colors.red.200}" },
    },
  },

  notice: {
    DEFAULT: {
      value: { base: "{colors.yellow.300}", _dark: "{colors.yellow.400}" },
    },
    on: {
      value: { base: "{colors.black}", _dark: "{colors.white}" },
    },
    container: {
      value: { base: "{colors.yellow.200}", _dark: "{colors.yellow.800}" },
    },
    onContainer: {
      value: { base: "{colors.black}", _dark: "{colors.white}" },
    },
    containerVariant: {
      value: { base: "{colors.yellow.100}", _dark: "{colors.yellow.900}" },
    },
    onContainerVariant: {
      value: { base: "{colors.black}", _dark: "{colors.gray.100}" },
    },
  },

  // ============================================================
  // Component（構成）— UI要素の形成に用いるロール
  // ============================================================

  surface: {
    DEFAULT: {
      value: { base: "{colors.white}", _dark: "{colors.neutral.1000}" },
    },
    on: {
      value: { base: "{colors.black}", _dark: "{colors.gray.200}" },
    },
    onVariant: {
      value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
    },
    dim: {
      value: { base: "{colors.neutral.300}", _dark: "{colors.neutral.1000}" },
    },
    bright: {
      value: { base: "{colors.white}", _dark: "{colors.neutral.700}" },
    },
    container: {
      value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" },
    },
    containerBright: {
      value: { base: "{colors.white}", _dark: "{colors.neutral.900}" },
    },
    containerDim: {
      value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.600}" },
    },
    inverse: {
      value: { base: "{colors.gray.1000}", _dark: "{colors.gray.100}" },
    },
    inverseOn: {
      value: { base: "{colors.white}", _dark: "{colors.black}" },
    },
    inversePrimary: {
      value: { base: "{colors.blue.100}", _dark: "{colors.blue.1000}" },
    },
  },

  outline: {
    DEFAULT: {
      value: { base: "{colors.gray.300}", _dark: "{colors.gray.700}" },
    },
    bright: {
      value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
    },
    dim: {
      value: { base: "{colors.gray.500}", _dark: "{colors.gray.500}" },
    },
  },

  scrim: {
    value: {
      base: "{colors.transparency.bl20}",
      _dark: "{colors.transparency.bl60}",
    },
  },

  // ============================================================
  // Interaction（インタラクション）— 状態変化を表現するロール
  // ============================================================

  hovered: {
    DEFAULT: {
      value: {
        base: "{colors.transparency.bl20}",
        _dark: "{colors.transparency.wh20}",
      },
    },
    variant: {
      value: {
        base: "{colors.transparency.bl5}",
        _dark: "{colors.transparency.wh5}",
      },
    },
    onPrimary: {
      value: {
        base: "{colors.transparency.wh60}",
        _dark: "{colors.transparency.bl60}",
      },
    },
  },

  selected: {
    DEFAULT: {
      value: {
        base: "{colors.transparency.bl2}",
        _dark: "{colors.transparency.wh2}",
      },
    },
    surface: {
      value: { base: "{colors.blue.300}", _dark: "{colors.blue.800}" },
    },
  },

  disabled: {
    DEFAULT: {
      value: { base: "{colors.gray.100}", _dark: "{colors.gray.900}" },
    },
    onSurface: {
      value: { base: "{colors.gray.400}", _dark: "{colors.gray.600}" },
    },
  },
});
