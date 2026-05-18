export default class MenuSpy {
  constructor(element) {
    this.nav = element;

    this.scope = this.nav.closest("[data-spy-scope]");
    if (!this.scope) {
      console.warn("MenuSpy: No [data-spy-scope] parent found.");
      return;
    }

    this.triggers = this.nav.querySelectorAll('[data-behavior="tab-head"]');
    this.targets = this.scope.querySelectorAll('[data-behavior="tab-content"]');

    this.observer = null;
    this.options = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // Active zone logic
      threshold: 0,
    };
    this._suspended = false;
    this._resumeTimer = null;

    this._publishStripHeight();
    this.init();
  }

  init() {
    if (!this.targets.length) return;

    // Capture-phase: tab-head's bubble listener calls stopImmediatePropagation.
    this.nav.addEventListener("click", (e) => this.handleScroll(e), true);

    this.observer = new IntersectionObserver(this.onIntersect.bind(this), this.options);
    this.targets.forEach((target) => {
      this.observer.observe(target);
    });

    window.addEventListener("resize", () => this._publishStripHeight());
  }

  _publishStripHeight() {
    document.documentElement.style.setProperty("--chip-strip-h", `${this.nav.offsetHeight}px`);
  }

  handleScroll(e) {
    const trigger = e.target.closest('[data-behavior="tab-head"]');
    if (!trigger || !this.nav.contains(trigger)) return;

    e.preventDefault();
    const tabId = trigger.dataset.tabId;

    const target = this.scope.querySelector(
      `[data-behavior="tab-content"][data-tab-id="${tabId}"]`
    );
    if (!target) return;

    // Click intent wins: suspend the observer for the duration of the smooth
    // scroll so transient pane intersections don't flicker the active chip.
    this._suspend();
    this.activateTrigger(tabId);

    // scrollIntoView respects html { scroll-padding-top } + the target's
    // scroll-margin-top (per-section), so the target lands below the sticky
    // header + chip strip with the section's configured breathing room.
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    this._scheduleResume();
  }

  onIntersect(entries) {
    if (this._suspended) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.activateTrigger(entry.target.dataset.tabId);
      }
    });
  }

  _suspend() {
    this._suspended = true;
    clearTimeout(this._resumeTimer);
  }

  _scheduleResume() {
    const resume = () => {
      this._suspended = false;
    };
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", resume, { once: true });
    } else {
      this._resumeTimer = setTimeout(resume, 700);
    }
  }

  activateTrigger(tabId) {
    const activeTrigger = this.nav.querySelector(
      `[data-behavior="tab-head"][data-tab-id="${tabId}"]`
    );
    if (!activeTrigger) return;

    // Center the active chip inside the strip when it overflows. Scrolling
    // the strip directly (instead of scrollIntoView) keeps this purely on
    // the chip-strip's own scroll axes — never moves page Y.
    this._centerChipInStrip(activeTrigger);

    const groupId = activeTrigger.getAttribute("data-tab-group");
    if (groupId) {
      document.dispatchEvent(
        new CustomEvent("tab:activated", {
          detail: { tabId, groupId },
        })
      );
    } else {
      this.triggers.forEach((t) => t.classList.remove("is-active"));
      activeTrigger.classList.add("is-active");
    }
  }

  _centerChipInStrip(chip) {
    const chipRect = chip.getBoundingClientRect();
    const stripRect = this.nav.getBoundingClientRect();

    if (this.nav.scrollWidth > this.nav.clientWidth) {
      const chipCenterX = (chipRect.left + chipRect.right) / 2;
      const stripCenterX = (stripRect.left + stripRect.right) / 2;
      this.nav.scrollBy({ left: chipCenterX - stripCenterX, behavior: "smooth" });
    }
    if (this.nav.scrollHeight > this.nav.clientHeight) {
      const chipCenterY = (chipRect.top + chipRect.bottom) / 2;
      const stripCenterY = (stripRect.top + stripRect.bottom) / 2;
      this.nav.scrollBy({ top: chipCenterY - stripCenterY, behavior: "smooth" });
    }
  }
}
