export default class TabContent {
  constructor(el) {
    this.el = el;
    this.tabId = this.el.getAttribute("data-tab-id");
    this.groupId = this.el.getAttribute("data-tab-group");

    this._baseClass = this.el.className || "";
    this._baseStyle = this.el.style.cssText || "";

    this.handleGlobalSwitch = this.handleGlobalSwitch.bind(this);

    this.init();
  }

  init() {
    const myHead = document.querySelector(
      `[data-behavior="tab-head"][data-tab-id="${this.tabId}"][data-tab-group="${this.groupId}"]`
    );

    let shouldBeActive;

    if (myHead) {
      shouldBeActive = myHead.hasAttribute("aria-selected")
        ? myHead.getAttribute("aria-selected") === "true"
        : document.querySelector(`[data-behavior="tab-head"][data-tab-group="${this.groupId}"]`) ===
          myHead;
    } else {
      const familyMembers = document.querySelectorAll(
        `.tab-content[data-tab-group="${this.groupId}"]`
      );
      const explicitActive = this.el.getAttribute("aria-expanded") === "true";
      const anySiblingActive = Array.from(familyMembers).some(
        (content) => content.getAttribute("aria-expanded") === "true"
      );
      const isFirst = familyMembers[0] === this.el;
      shouldBeActive = explicitActive || (!anySiblingActive && isFirst);
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
