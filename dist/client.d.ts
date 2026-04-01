/**
 * Returns a version of `color` with full saturation and a fixed lightness of 55%,
 * suitable as the "primary" shade for theming.
 */
declare function getPrimaryShadeColor(color: string): string;
/**
 * Returns a text color (dark or light) that contrasts well against `color`.
 * Useful for rendering text on top of a dynamic background.
 *
 * @param color         - Background color hex string (default: `"#ffffff"`).
 * @param darkenAmount  - Darken factor applied when the background is light (default: `0.3`).
 * @param lightenAmount - Lighten factor applied when the background is dark (default: `0.1`).
 */
declare function getBackgroundTextColor(color?: string | undefined | null, darkenAmount?: number, lightenAmount?: number): string;
/**
 * Returns a background color that contrasts well against `color`, based on luminance.
 * Useful for generating complementary backgrounds in dynamic themes.
 *
 * @param color         - Base color hex string (default: `"#ffffff"`).
 * @param darkenAmount  - Darken factor (default: `0.3`).
 * @param lightenAmount - Lighten factor (default: `0.8`).
 */
declare function getBackgroundColor(color?: string | undefined | null, darkenAmount?: number, lightenAmount?: number): string;
/**
 * Extracts the dominant and background colors from a remote image URL.
 * Uses canvas-based pixel analysis with edge detection.
 *
 * Browser-only — requires `document` and `HTMLCanvasElement`.
 *
 * @param imageUrl               - URL of the image to analyze.
 * @param fallbackDominantColor  - Returned if extraction fails (default: `"#000000"`).
 * @param fallbackBackgroundColor - Returned if extraction fails (default: `"#ffffff"`).
 * @returns `{ dominant: string, background: string }` hex color pair.
 */
declare const getDominantColorFromImageUrl: (imageUrl: string, fallbackDominantColor?: string, fallbackBackgroundColor?: string) => Promise<{
    dominant: string;
    background: string;
}>;
/**
 * React hook that provides helpers for building and modifying URL query strings.
 * Requires **Next.js** (uses `next/navigation`).
 *
 * @returns
 *   - `createQueryString(name, value)` — Returns a query string with `name` set to `value`,
 *     preserving all existing params.
 *   - `deleteParamFromQueryString(name)` — Returns a query string with `name` removed,
 *     preserving all other params.
 */
declare const useQueryParamBuilder: () => {
    createQueryString: (name: string, value: string) => string;
    deleteParamFromQueryString: (name: string) => string;
};

export { useQueryParamBuilder as default, getBackgroundColor, getBackgroundTextColor, getDominantColorFromImageUrl, getPrimaryShadeColor };
