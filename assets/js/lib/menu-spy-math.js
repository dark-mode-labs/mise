/**
 * Pure-logic helpers for `components/menu-spy.js`.
 */

/**
 * Default top-of-page offset (px) used when scrolling a target into
 * view, leaving room for a sticky header / nav.
 */
export const DEFAULT_SCROLL_OFFSET_PX = 120;

/**
 * Compute the absolute Y coordinate to scroll the page to so that
 * `elementTopFromViewport` lands `offsetPx` below the viewport top.
 *
 * @param {number} elementTopFromViewport  `getBoundingClientRect().top`
 * @param {number} pageYOffset             `window.pageYOffset`
 * @param {number} [offsetPx]              defaults to DEFAULT_SCROLL_OFFSET_PX
 * @returns {number}                       never negative
 */
export function computeScrollTarget(
  elementTopFromViewport,
  pageYOffset,
  offsetPx = DEFAULT_SCROLL_OFFSET_PX
) {
  const top = Number.isFinite(elementTopFromViewport) ? elementTopFromViewport : 0;
  const page = Number.isFinite(pageYOffset) ? pageYOffset : 0;
  const offset = Number.isFinite(offsetPx) ? offsetPx : DEFAULT_SCROLL_OFFSET_PX;
  return Math.max(0, top + page - offset);
}
