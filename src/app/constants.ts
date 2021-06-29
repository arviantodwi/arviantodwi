// Viewport breakpoints
// This entries are based on Bulma responsiveness breakpoints. You may see the
// documentation in https://bulma.io/documentation/overview/responsiveness/
export const BP_MOBILE = "768px";
export const BP_TABLET = "769px";
export const BP_DESKTOP = "1024px";
export const BP_WIDESCREEN = "1216px";
export const BP_FULLHD = "1408px";

// Theme colors
class Color {
  readonly HEX: string;
  readonly RGB: string | null;

  constructor(hex: string, rgb: string | null = null) {
    this.HEX = hex;
    this.RGB = rgb;
  }
}
export const COLOR_TAN = new Color("#EED6C6");
export const COLOR_BROWN = new Color("#735E4C");
export const COLOR_TOMATO = new Color("#BF584E");
export const COLOR_TEXT = new Color("#000", "0,0,0");
export const COLOR_WHITE = new Color("#FFF", "255,255,255");
