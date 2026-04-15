export default class Tabs {
  constructor(el) {
    this.el = el;
    this.tabId = this.el.getAttribute('data-action-args');
    // Grab the family ID
    this.groupId = this.el.getAttribute('data-tab-group');

    this._baseClass = this.el.className || '';
    this._baseStyle = this.el.style.cssText || '';

    // Scope the content search to the same group!
    this.contentEl = document.querySelector(`.tab-content[data-action-args="${this.tabId}"][data-tab-group="${this.groupId}"]`);

    this.handleGlobalSwitch = this.handleGlobalSwitch.bind(this);
    this.init();
  }

  init() {
    // 1. Find all tabs in my specific group
    const familyMembers = document.querySelectorAll(`[data-action="tab-switch"][data-tab-group="${this.groupId}"]`);

    // 2. Check if any tab in my group was explicitly marked active in the HTML
    const someoneIsActive = Array.from(familyMembers).some(tab => tab.getAttribute('aria-selected') === 'true');

    // 3. Am I the first tab in the DOM for this group?
    const amIFirst = familyMembers[0] === this.el;

    // 4. Activate if I have the attribute, OR if nobody has the attribute and I'm the first one
    const shouldBeActive = this.el.getAttribute('aria-selected') === 'true' || (!someoneIsActive && amIFirst);

    // Apply the correct state instantly on load
    this.setState(shouldBeActive);

    this.el.addEventListener('click', () => {
      // Include the groupId in the broadcast payload
      document.dispatchEvent(new CustomEvent('tab:activated', {
        detail: { tabId: this.tabId, groupId: this.groupId }
      }));
    });

    document.addEventListener('tab:activated', this.handleGlobalSwitch);
  }

  handleGlobalSwitch(event) {
    if (event.detail.groupId !== this.groupId) return;
    const isMe = event.detail.tabId === this.tabId;
    this.setState(isMe);
  }

  setState(isActive) {
    this.el.setAttribute('aria-selected', isActive ? 'true' : 'false');

    const stateClasses = this.el.getAttribute(isActive ? 'data-tab-active-class' : 'data-tab-inactive-class') || '';
    const stateStyles = this.el.getAttribute(isActive ? 'data-tab-active-styles' : 'data-tab-inactive-styles') || '';

    this.el.className = `${this._baseClass} ${stateClasses}`.trim();
    this.el.style.cssText = `${this._baseStyle}; ${stateStyles}`.trim();

    if (this.contentEl) {
      this.contentEl.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
  }
}