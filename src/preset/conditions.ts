export const conditions = {
  light: "[data-color-mode=light] &",
  dark: "[data-color-mode=dark] &",
  // preset-base の _hover / _active を上書きし、data-disabled 時はスタイルを適用しない
  hover: "&:is(:hover, [data-hover]):not([data-disabled])",
  active: "&:is(:active, [data-active]):not([data-disabled])",
};
