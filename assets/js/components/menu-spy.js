import { computeScrollTarget } from "../lib/menu-spy-math.js";

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
  }

  handleScroll(e) {
    e.preventDefault();
    const uuid = e.currentTarget.dataset.spyTrigger;

    const target = this.scope.querySelector(`[data-spy-target="${uuid}"]`);

    if (target) {
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = computeScrollTarget(elementPosition, window.pageYOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  onIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const uuid = entry.target.dataset.spyTarget;
        this.activateTrigger(uuid);
      }
    });
  }

  activateTrigger(uuid) {
    const activeTrigger = this.nav.querySelector(`[data-spy-trigger="${uuid}"]`);
    if (!activeTrigger) return;

    // Keep the active chip visible when the nav is itself scrollable
    // (e.g. horizontal chip carousel). block:'nearest' avoids page-Y scroll.
    activeTrigger.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

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

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
