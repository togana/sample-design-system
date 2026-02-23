import type { SemanticTokens } from "@pandacss/dev";

export const semanticColors: SemanticTokens["colors"] = {
  // --- 背景 ---
  bg: {
    DEFAULT: {
      value: { base: "white", _dark: "{colors.gray.950}" },
    },
    subtle: {
      DEFAULT: {
        value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" },
      },
      hover: {
        value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
      },
      active: {
        value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
      },
    },
    surface: {
      DEFAULT: {
        value: { base: "white", _dark: "{colors.gray.900}" },
      },
      hover: {
        value: { base: "{colors.gray.50}", _dark: "{colors.gray.800}" },
      },
      active: {
        value: { base: "{colors.gray.100}", _dark: "{colors.gray.700}" },
      },
    },
    fill: {
      brand: {
        DEFAULT: {
          value: { base: "{colors.blue.600}", _dark: "{colors.blue.500}" },
        },
        hover: {
          value: { base: "{colors.blue.700}", _dark: "{colors.blue.400}" },
        },
        active: {
          value: { base: "{colors.blue.800}", _dark: "{colors.blue.300}" },
        },
      },
      danger: {
        DEFAULT: {
          value: { base: "{colors.red.600}", _dark: "{colors.red.500}" },
        },
        hover: {
          value: { base: "{colors.red.700}", _dark: "{colors.red.400}" },
        },
        active: {
          value: { base: "{colors.red.800}", _dark: "{colors.red.300}" },
        },
      },
      success: {
        DEFAULT: {
          value: { base: "{colors.green.600}", _dark: "{colors.green.500}" },
        },
      },
      disabled: {
        value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
      },
    },
  },
  // --- テキスト ---
  text: {
    primary: {
      value: { base: "{colors.gray.950}", _dark: "{colors.gray.50}" },
    },
    secondary: {
      value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
    },
    disabled: {
      value: { base: "{colors.gray.400}", _dark: "{colors.gray.600}" },
    },
    brand: {
      value: { base: "{colors.blue.600}", _dark: "{colors.blue.400}" },
    },
    danger: {
      value: { base: "{colors.red.600}", _dark: "{colors.red.400}" },
    },
    success: {
      value: { base: "{colors.green.600}", _dark: "{colors.green.400}" },
    },
    warning: {
      value: { base: "{colors.yellow.600}", _dark: "{colors.yellow.400}" },
    },
    onFill: {
      value: { base: "white", _dark: "white" },
    },
  },
  // --- ボーダー ---
  border: {
    DEFAULT: {
      value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
    },
    strong: {
      value: { base: "{colors.gray.300}", _dark: "{colors.gray.700}" },
    },
    focus: {
      value: { base: "{colors.blue.500}", _dark: "{colors.blue.400}" },
    },
    danger: {
      value: { base: "{colors.red.500}", _dark: "{colors.red.400}" },
    },
  },
  // --- アイコン ---
  icon: {
    DEFAULT: {
      value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
    },
    brand: {
      value: { base: "{colors.blue.600}", _dark: "{colors.blue.400}" },
    },
    danger: {
      value: { base: "{colors.red.600}", _dark: "{colors.red.400}" },
    },
    success: {
      value: { base: "{colors.green.600}", _dark: "{colors.green.400}" },
    },
  },
};
