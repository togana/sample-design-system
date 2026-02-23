import type { TextStyles } from "@pandacss/dev";

/**
 * テキストスタイル（コンポジットタイポグラフィ）
 * Serendie Design System の system/typography (expanded) に準拠
 * @see https://github.com/serendie/design-token/blob/main/tokens/system/typography.expanded.json
 */
export const textStyles: TextStyles = {
  display: {
    small: {
      value: {
        fontSize: "{fontSizes.fourExtraLarge}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    medium: {
      value: {
        fontSize: "{fontSizes.fiveExtraLarge}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
  },
  headline: {
    small: {
      value: {
        fontSize: "{fontSizes.extraLarge}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    medium: {
      value: {
        fontSize: "{fontSizes.twoExtraLarge}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    large: {
      value: {
        fontSize: "{fontSizes.threeExtraLarge}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
  },
  title: {
    small: {
      value: {
        fontSize: "{fontSizes.small}",
        fontWeight: "{fontWeights.bold}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    medium: {
      value: {
        fontSize: "{fontSizes.medium}",
        fontWeight: "{fontWeights.bold}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    large: {
      value: {
        fontSize: "{fontSizes.large}",
        fontWeight: "{fontWeights.bold}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
  },
  body: {
    extraSmall: {
      value: {
        fontSize: "{fontSizes.twoExtraSmall}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.tight}",
      },
    },
    small: {
      value: {
        fontSize: "{fontSizes.extraSmall}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    medium: {
      value: {
        fontSize: "{fontSizes.small}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
    large: {
      value: {
        fontSize: "{fontSizes.medium}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.normal}",
      },
    },
  },
  label: {
    small: {
      value: {
        fontSize: "{fontSizes.threeExtraSmall}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.none}",
      },
    },
    medium: {
      value: {
        fontSize: "{fontSizes.twoExtraSmall}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.none}",
      },
    },
    large: {
      value: {
        fontSize: "{fontSizes.extraSmall}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.none}",
      },
    },
    extraLarge: {
      value: {
        fontSize: "{fontSizes.small}",
        fontWeight: "{fontWeights.regular}",
        fontFamily: "{fonts.primary}",
        lineHeight: "{lineHeights.none}",
      },
    },
  },
};
