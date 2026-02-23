import {
  borderWidths,
  colors,
  fontSizes,
  fontWeights,
  fonts,
  lineHeights,
  radii,
  shadows,
  sizes,
  spacing,
  zIndex,
} from "./tokens";
import { colors as semanticColors } from "./semantic-tokens";
import { textStyles } from "./styles";

export const theme = {
  tokens: {
    colors,
    spacing,
    sizes,
    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    radii,
    borderWidths,
    shadows,
    zIndex,
  },
  semanticTokens: {
    colors: semanticColors,
  },
  textStyles,
};
