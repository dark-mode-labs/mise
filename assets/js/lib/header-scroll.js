/**
 * Pure-logic state evaluator for `components/header.js`. The
 * controller hands us the latest scroll position + the configured
 * sticky/transparent flags; we hand back the visual state to apply.
 */

/**
 * @typedef {Object} HeaderConfig
 * @property {string} [sticky]      e.g. "on_scroll_up" | undefined
 * @property {boolean} [transparent]
 *
 * @typedef {Object} HeaderInputs
 * @property {number} y             current scrollY
 * @property {number} prevY         previous scrollY
 * @property {number} headerHeight  measured header height in px
 *
 * @typedef {Object} HeaderState
 * @property {boolean | null} transparent  null = leave class as-is
 * @property {boolean | null} hidden       null = leave class as-is
 */

/**
 * Top-of-page threshold for the "transparent" treatment.
 * Mirrors the literal in the original controller (y < 20).
 */
export const TRANSPARENT_TOP_THRESHOLD = 20;

/**
 * Decide whether the header should be transparent right now.
 * Returns null when transparency is disabled (controller leaves the
 * class alone).
 *
 * @param {number} y
 * @param {boolean} transparentEnabled
 * @returns {boolean | null}
 */
export function shouldBeTransparent(y, transparentEnabled) {
  if (!transparentEnabled) return null;
  return y < TRANSPARENT_TOP_THRESHOLD;
}

/**
 * Decide whether a sticky-on-scroll-up header should be hidden.
 * Returns true → apply `-translate-y-full`, false → remove it,
 * null → leave as-is.
 *
 * @param {number} y
 * @param {number} prevY
 * @param {number} headerHeight
 * @param {string | undefined} stickyMode
 * @returns {boolean | null}
 */
export function shouldHideHeader(y, prevY, headerHeight, stickyMode) {
  if (stickyMode !== "on_scroll_up") return null;
  const scrollDown = y > prevY;
  if (y > headerHeight && scrollDown) return true;
  if (!scrollDown) return false;
  return null;
}

/**
 * Top-level evaluator: combines transparency + hide rules into a
 * single state object the controller applies in one pass.
 * Negative y values (overscroll bounce) → returns no change.
 *
 * @param {HeaderInputs} inputs
 * @param {HeaderConfig} config
 * @returns {HeaderState}
 */
export function evaluateHeaderState(inputs, config) {
  if (!inputs || inputs.y < 0) return { transparent: null, hidden: null };
  return {
    transparent: shouldBeTransparent(inputs.y, !!config.transparent),
    hidden: shouldHideHeader(inputs.y, inputs.prevY, inputs.headerHeight, config.sticky),
  };
}
