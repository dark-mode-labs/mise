export default class MenuSpy {
  constructor(element) {
    this.nav = element;

    this.scope = this.nav.closest("[data-spy-scope]");
    if (!this.scope) {
      console.warn("MenuSpy: No [data-spy-scope] parent found.");
      return;
    }

    this.triggers = this.nav.querySelectorAll("[data-spy-trigger]");
    this.targets = this.scope.querySelectorAll("[data-spy-target]");

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

    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => this.handleScroll(e));
    });

    this.observer = new IntersectionObserver(this.onIntersect.bind(this), this.options);
    this.targets.forEach((target) => {
      this.observer.observe(target);
    });

    window.addEventListener("resize", () => this._publishStripHeight());
  }

  _publishStripHeight() {
    const root = document.documentElement.style;
    root.setProperty("--chip-strip-h", `${this.nav.offsetHeight}px`);

    const panes = this.scope.querySelector(".tab-panes");
    if (panes) {
      const gap = getComputedStyle(panes).rowGap;
      if (gap && gap !== "normal") root.setProperty("--pane-gap-spy", gap);
    }
  }

  handleScroll(e) {
    e.preventDefault();
    const uuid = e.currentTarget.dataset.spyTrigger;

    const target = this.scope.querySelector(`[data-spy-target="${uuid}"]`);
    if (!target) return;

    // Click intent wins: suspend the observer for the duration of the smooth
    // scroll so transient pane intersections don't flicker the active chip.
    this._suspend();
    this.activateTrigger(uuid);

    // scrollIntoView respects html { scroll-padding-top }, so the target lands
    // below the sticky header + chip strip automatically.
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    this._scheduleResume();
  }

  onIntersect(entries) {
    if (this._suspended) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const uuid = entry.target.dataset.spyTarget;
        this.activateTrigger(uuid);
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

  activateTrigger(uuid) {
    const activeTrigger = this.nav.querySelector(`[data-spy-trigger="${uuid}"]`);
    if (!activeTrigger) return;

    // Center the active chip inside the strip when it overflows. Scrolling
    // the strip directly (instead of scrollIntoView) keeps this purely on
    // the chip-strip's own scroll axes — never moves page Y.
    this._centerChipInStrip(activeTrigger);

    // If the trigger is wired into the tab system (data-tab-group present),
    // dispatch tab:activated so tab-head.js owns the active styling. Otherwise
    // fall back to the raw .is-active toggle for non-tab consumers.
    const groupId = activeTrigger.getAttribute("data-tab-group");
    if (groupId) {
      document.dispatchEvent(
        new CustomEvent("tab:activated", {
          detail: { tabId: uuid, groupId },
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

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
