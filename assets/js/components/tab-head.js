export default class TabHead {
  constructor(el) {
    this.el = el;
    this.tabId = this.el.getAttribute('data-action-args');
    this.groupId = this.el.getAttribute('data-tab-group');

    this._baseClass = this.el.className || '';
    this._baseStyle = this.el.style.cssText || '';

    this.handleGlobalSwitch = this.handleGlobalSwitch.bind(this);
    this.init();
  }

  init() {
    const familyMembers = document.querySelectorAll(`[data-action="tab-switch"][data-tab-group="${this.groupId}"]`);
    const someoneIsActive = Array.from(familyMembers).some(tab => tab.getAttribute('aria-selected') === 'true');
    const amIFirst = familyMembers[0] === this.el;
    const shouldBeActive = this.el.getAttribute('aria-selected') === 'true' || (!someoneIsActive && amIFirst);

    this.setState(shouldBeActive);

    this.el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

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
  }
}