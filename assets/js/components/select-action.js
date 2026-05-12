/**
 * Generic <select> action bridge. Mirrors how `_tab-head` translates a
 * click on `data-action="tab-switch"` into a `tab:activated` event —
 * but for change events on a <select>. Extend the switch below as new
 * action types come online (filter-switch, scroll-to, etc.).
 *
 * Attribute contract:
 *   data-behavior="select-action"   – auto-loads this module
 *   data-action="<action-name>"     – which event to dispatch
 *   data-action-group="<group-id>"  – grouping id passed through to listeners
 */
export default class SelectAction {
  constructor(element) {
    this.el = element;
    this.action = this.el.getAttribute("data-action");
    this.groupId = this.el.getAttribute("data-action-group");

    this.el.addEventListener("change", () => this.dispatch());
  }

  dispatch() {
    const value = this.el.value;
    switch (this.action) {
      case "tab-switch":
        document.dispatchEvent(
          new CustomEvent("tab:activated", {
            detail: { tabId: value, groupId: this.groupId },
          })
        );
        break;
      default:
        console.warn(`[SelectAction] Unknown action: ${this.action}`);
    }
  }
}
