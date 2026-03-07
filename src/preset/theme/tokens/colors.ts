import { defineTokens } from "@pandacss/dev";

/**
 * プリミティブカラートークン
 * 値は Serendie Design System のリファレンスカラーから流用
 * @see https://serendie.design/foundations/color/
 */
export const colors = defineTokens.colors({
  transparent: { value: "transparent" },
  white: { value: "#FFFFFF" },
  black: { value: "#000000" },

  // 半透明トークン（インタラクション状態レイヤー用）
  transparency: {
    bl2: { value: "#00000005" },
    bl5: { value: "#0000000D" },
    bl20: { value: "#00000033" },
    bl60: { value: "#00000099" },
    wh2: { value: "#FFFFFF05" },
    wh5: { value: "#FFFFFF0D" },
    wh20: { value: "#FFFFFF33" },
    wh60: { value: "#FFFFFF99" },
  },

  gray: {
    100: { value: "#F0F0F0" },
    200: { value: "#E4E4E3" },
    300: { value: "#D1D0CD" },
    400: { value: "#B1B0AE" },
    500: { value: "#8C8B87" },
    600: { value: "#6F6F6F" },
    700: { value: "#575757" },
    800: { value: "#424242" },
    900: { value: "#31312F" },
    1000: { value: "#232322" },
  },

  // Surface 系で使用するニュートラルパレット（gray とは別系統）
  neutral: {
    100: { value: "#FAFAFA" },
    200: { value: "#F5F5F5" },
    300: { value: "#F0F0F0" },
    400: { value: "#EBEBEB" },
    500: { value: "#E5E5E5" },
    600: { value: "#474747" },
    700: { value: "#3B3B3B" },
    800: { value: "#2E2E2E" },
    900: { value: "#212121" },
    1000: { value: "#141414" },
  },

  blue: {
    100: { value: "#EFF2FC" },
    200: { value: "#DDE3FF" },
    300: { value: "#C0CFFD" },
    400: { value: "#8FAEFE" },
    500: { value: "#3B86F9" },
    600: { value: "#056AD8" },
    700: { value: "#0353AA" },
    800: { value: "#043F81" },
    900: { value: "#073165" },
    1000: { value: "#081E3F" },
  },

  red: {
    100: { value: "#FCEBEA" },
    200: { value: "#FFDCDA" },
    300: { value: "#FFC0BB" },
    400: { value: "#FF8F8F" },
    500: { value: "#F64157" },
    600: { value: "#D00138" },
    700: { value: "#A4002A" },
    800: { value: "#81001F" },
    900: { value: "#600114" },
    1000: { value: "#400109" },
  },

  green: {
    100: { value: "#DBF5EA" },
    200: { value: "#BCEEDD" },
    300: { value: "#90E4C7" },
    400: { value: "#46D2A2" },
    500: { value: "#2EAB80" },
    600: { value: "#2C7C60" },
    700: { value: "#146348" },
    800: { value: "#174A38" },
    900: { value: "#12372B" },
    1000: { value: "#0D271E" },
  },

  yellow: {
    100: { value: "#FAF4E3" },
    200: { value: "#FCE998" },
    300: { value: "#EDD857" },
    400: { value: "#DEC400" },
    500: { value: "#A78E00" },
    600: { value: "#816E00" },
    700: { value: "#645600" },
    800: { value: "#514400" },
    900: { value: "#3A3000" },
    1000: { value: "#292200" },
  },
});
