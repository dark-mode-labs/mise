/**
 * Pure-logic helpers for `components/slideshow.js`. No DOM access; the
 * controller measures the DOM and passes scalars to these.
 */

/**
 * Width per slide (in px) so `cols` slides fill the wrapper exactly,
 * accounting for inter-slide gaps and an optional peek ratio that lets
 * the next slide's edge show through at the right.
 *
 * @param {number} wrapperWidthPx
 * @param {number} cols
 * @param {number} peekPct        0..1 (e.g. 0.15 = 15% peek)
 * @param {number} gapPx
 * @returns {number}
 */
export function computeExactSlideWidth(wrapperWidthPx, cols, peekPct, gapPx) {
  const c = Math.max(1, cols | 0);
  const peek = Number.isFinite(peekPct) && peekPct > 0 ? peekPct : 0;
  const gap = Number.isFinite(gapPx) ? gapPx : 0;
  const visibleGaps = peek > 0 ? c : Math.max(0, c - 1);
  const wrapper = Number.isFinite(wrapperWidthPx) ? wrapperWidthPx : 0;
  return (wrapper - gap * visibleGaps) / (c + peek);
}

/**
 * Number of pages in the slideshow.
 *
 * @param {number} totalSlides
 * @param {number} cols
 * @returns {number}
 */
export function getPageCount(totalSlides, cols) {
  const t = Math.max(0, totalSlides | 0);
  const c = Math.max(1, cols | 0);
  return Math.ceil(t / c);
}

/**
 * Page index (0-based) that contains the slide at `slideIndex`.
 *
 * @param {number} slideIndex
 * @param {number} cols
 * @returns {number}
 */
export function getCurrentPageFromIndex(slideIndex, cols) {
  const i = Math.max(0, slideIndex | 0);
  const c = Math.max(1, cols | 0);
  return Math.floor(i / c);
}

/**
 * Target slide index for "next page" navigation. Returns null when
 * already on the last page and not infinite (controller short-circuits).
 *
 * @param {number} currentIndex
 * @param {number} cols
 * @param {number} totalSlides
 * @param {boolean} infinite
 * @returns {number | null}
 */
export function getNextSlideIndex(currentIndex, cols, totalSlides, infinite) {
  const c = Math.max(1, cols | 0);
  const t = Math.max(0, totalSlides | 0);
  const curr = Math.max(0, currentIndex | 0);
  const maxLeftIndex = Math.max(0, t - c);
  if (curr >= maxLeftIndex) {
    return infinite ? 0 : null;
  }
  return curr + c;
}

/**
 * Target slide index for "prev page" navigation. Returns null when
 * already at the start and not infinite.
 *
 * @param {number} currentIndex
 * @param {number} cols
 * @param {number} totalSlides
 * @param {boolean} infinite
 * @returns {number | null}
 */
export function getPrevSlideIndex(currentIndex, cols, totalSlides, infinite) {
  const c = Math.max(1, cols | 0);
  const t = Math.max(0, totalSlides | 0);
  const curr = currentIndex | 0;

  if (curr <= 0) {
    return infinite ? Math.max(0, t - 1) : null;
  }

  // Snap to the start of the current page if the user is mid-page;
  // otherwise step back a full page.
  return curr % c !== 0 ? Math.max(0, Math.floor(curr / c) * c) : Math.max(0, curr - c);
}

/**
 * Clamp a page index into [0, pageCount-1]. Used by the dot pager.
 *
 * @param {number} pageIndex
 * @param {number} pageCount
 * @returns {number}
 */
export function clampPageIndex(pageIndex, pageCount) {
  if (pageCount <= 0) return 0;
  return Math.max(0, Math.min(pageIndex | 0, pageCount - 1));
}
