export default class TabContent {
    constructor(el) {
        this.el = el;
        this.tabId = this.el.getAttribute('data-action-args');
        this.groupId = this.el.getAttribute('data-tab-group');

        this.handleGlobalSwitch = this.handleGlobalSwitch.bind(this);

        this.init();
    }

    init() {
        const myHead = document.querySelector(`[data-behavior="tab-head"][data-action-args="${this.tabId}"][data-tab-group="${this.groupId}"]`);

        let shouldBeActive = false;

        // If my head has already been initialized (e.g. user clicked it before scrolling here), sync to it.
        if (myHead && myHead.hasAttribute('aria-selected')) {
            shouldBeActive = myHead.getAttribute('aria-selected') === 'true';
        } else {
            // Fallback: The head isn't ready yet, so determine state based on other contents
            const familyMembers = document.querySelectorAll(`.tab-content[data-tab-group="${this.groupId}"]`);
            const someoneIsActive = Array.from(familyMembers).some(content => content.getAttribute('aria-expanded') === 'true');
            const amIFirst = familyMembers[0] === this.el;

            shouldBeActive = this.el.getAttribute('aria-expanded') === 'true' || (!someoneIsActive && amIFirst);
        }

        // Set initial state instantly
        this.setState(shouldBeActive);

        // Listen to global broadcasts from the Tab Heads
        document.addEventListener('tab:activated', this.handleGlobalSwitch);
    }

    handleGlobalSwitch(event) {
        // Ignore events from other groups
        if (event.detail.groupId !== this.groupId) return;

        // Am I the content for the tab that was just clicked?
        const isMe = event.detail.tabId === this.tabId;

        this.setState(isMe);
    }

    setState(isActive) {
        this.el.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
}