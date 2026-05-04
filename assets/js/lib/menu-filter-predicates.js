/**
 * Pure-logic predicates for `components/menu-filter.js`. The
 * controller flattens menu items off the DOM into the shape below
 * once at construct, then asks these predicates per state change.
 */

/**
 * @typedef {Object} FilterableItem
 * @property {string} name           lowercased item title
 * @property {string} description    lowercased item description
 * @property {string[]} tags         dietary / category tags
 *
 * @typedef {Object} FilterState
 * @property {string} search         lowercased search query
 * @property {Set<string>} activeTags
 */

/**
 * True when the item's name OR description contains the (already
 * lowercased) search string. Empty search matches everything.
 *
 * @param {FilterableItem} item
 * @param {string} query
 * @returns {boolean}
 */
export function matchesSearch(item, query) {
  if (!query) return true;
  if (!item) return false;
  const name = item.name || "";
  const desc = item.description || "";
  return name.includes(query) || desc.includes(query);
}

/**
 * True when the item carries every active tag (AND semantics). Empty
 * `activeTags` matches everything.
 *
 * @param {FilterableItem} item
 * @param {Iterable<string>} activeTags
 * @returns {boolean}
 */
export function matchesTags(item, activeTags) {
  const tagList = activeTags instanceof Set ? [...activeTags] : Array.from(activeTags || []);
  if (tagList.length === 0) return true;
  if (!item) return false;
  const itemTags = item.tags || [];
  return tagList.every((t) => itemTags.includes(t));
}

/**
 * Combined visibility predicate.
 *
 * @param {FilterableItem} item
 * @param {FilterState} state
 * @returns {boolean}
 */
export function isItemVisible(item, state) {
  return (
    matchesSearch(item, state.search || "") && matchesTags(item, state.activeTags || new Set())
  );
}

/**
 * True when the user has typed a query or toggled at least one tag.
 * The controller uses this to disable stagger animations during
 * filtering so the UI doesn't visibly shuffle.
 *
 * @param {FilterState} state
 * @returns {boolean}
 */
export function isFiltering(state) {
  if (!state) return false;
  const hasQuery = !!(state.search && state.search.length > 0);
  const tags = state.activeTags;
  const hasTags = tags instanceof Set ? tags.size > 0 : Array.from(tags || []).length > 0;
  return hasQuery || hasTags;
}
