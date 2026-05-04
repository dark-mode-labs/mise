/**
 * Pure-logic helpers for the tab-head/tab-content active-tab rule.
 *
 * The rule (used by both `components/tab-head.js` and
 * `components/tab-content.js`):
 *   1. If I'm explicitly marked active → I'm active.
 *   2. Else if no sibling in my group is marked active and I'm the
 *      first sibling → I'm active by default.
 *   3. Otherwise → not active.
 */

/**
 * @typedef {Object} TabActivationInputs
 * @property {boolean} explicitActive    am I explicitly aria-selected/expanded?
 * @property {boolean} anySiblingActive  is any sibling in this group active?
 * @property {boolean} isFirst           am I the first sibling?
 */

/**
 * @param {TabActivationInputs} inputs
 * @returns {boolean}
 */
export function shouldBeActiveTab(inputs) {
  if (!inputs) return false;
  if (inputs.explicitActive) return true;
  return !inputs.anySiblingActive && !!inputs.isFirst;
}
