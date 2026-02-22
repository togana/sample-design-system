import type { Tokens } from "@pandacss/dev";

/**
 * デフォルトブランドのカラー定義。
 * ブランド固有の色を追加する場合、このファイルをコピーして値を変更する。
 * セマンティックトークンは共通のまま、ここのプリミティブだけ差し替える。
 */
export const brandColors: Tokens["colors"] = {
  blue: {
    50: { value: "#eff6ff" },
    100: { value: "#dbeafe" },
    200: { value: "#bfdbfe" },
    300: { value: "#93c5fd" },
    400: { value: "#60a5fa" },
    500: { value: "#3b82f6" },
    600: { value: "#2563eb" },
    700: { value: "#1d4ed8" },
    800: { value: "#1e40af" },
    900: { value: "#1e3a8a" },
    950: { value: "#172554" },
  },
};
