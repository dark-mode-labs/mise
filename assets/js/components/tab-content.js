const SERVER_EXPANDED = new WeakMap();

function serverExpanded(el) {
  if (!SERVER_EXPANDED.has(el)) {
    for (const pane of document.querySelectorAll(".tab-content")) {
      if (!SERVER_EXPANDED.has(pane)) {
        SERVER_EXPANDED.set(pane, pane.getAttribute("aria-expanded") === "true");
      }
    }
    if (!SERVER_EXPANDED.has(el)) {
      SERVER_EXPANDED.set(el, el.getAttribute("aria-expanded") === "true");
    }
  }
  return SERVER_EXPANDED.get(el) === true;
}

export default class TabContent {
  constructor(el) {
    this.el = el;
    this.tabId = this.el.getAttribute("data-tab-id");
    this.groupId = this.el.getAttribute("data-tab-group");

    this._baseClass = this.el.className || "";
    this._baseStyle = this.el.style.cssText || "";
    this._serverExpanded = serverExpanded(this.el);

    this.handleGlobalSwitch = this.handleGlobalSwitch.bind(this);

    this.init();
  }

  family() {
    return Array.from(
      document.querySelectorAll(`.tab-content[data-tab-group="${this.groupId}"]`)
    ).filter((p) => p === this.el || !(p.contains(this.el) || this.el.contains(p)));
  }

  familyNamedADefault(family = this.family()) {
    return family.some((p) => serverExpanded(p));
  }

  init() {
    const myHead = document.querySelector(
      `[data-behavior="tab-head"][data-tab-id="${this.tabId}"][data-tab-group="${this.groupId}"]`
    );

    let shouldBeActive;

    if (myHead) {
      shouldBeActive = myHead.hasAttribute("aria-selected")
        ? myHead.getAttribute("aria-selected") === "true"
        : this.familyNamedADefault()
          ? this._serverExpanded
          : document.querySelector(
              `[data-behavior="tab-head"][data-tab-group="${this.groupId}"]`
            ) === myHead;
    } else {
      const family = this.family();
      shouldBeActive =
        this._serverExpanded || (!this.familyNamedADefault(family) && family[0] === this.el);
    }

    this.setState(shouldBeActive);

    document.addEventListener("tab:activated", this.handleGlobalSwitch);
  }

  handleGlobalSwitch(event) {
    if (event.detail.groupId !== this.groupId) return;

    const isMe = event.detail.tabId === this.tabId;

    this.setState(isMe);
  }

  setState(isActive) {
    this.el.setAttribute("aria-expanded", isActive ? "true" : "false");
    const stateClasses = (isActive && this.el.getAttribute("data-tab-active-class")) || "";
    const stateStyles = (isActive && this.el.getAttribute("data-tab-active-styles")) || "";
    this.el.className = `${this._baseClass} ${stateClasses}`.trim();
    this.el.style.cssText = `${this._baseStyle}; ${stateStyles}`.trim();
  }
}
