import { evaluateHeaderState } from "../lib/header-scroll.js";

export default class Header {
  constructor(element) {
    this.el = element;
    this.config = {
      sticky: this.el.dataset.sticky,
      transparent: this.el.dataset.transparent === "true",
    };

    this.lastScrollY = window.scrollY;
    this.headerHeight = this.el.offsetHeight;
    this.ticking = false;

    this._publishHeaderHeight();
    this.init();
  }

  _publishHeaderHeight() {
    document.documentElement.style.setProperty("--header-h", `${this.headerHeight}px`);
  }

  init() {
    const drawer = this.el.querySelector(".header-drawer");

    document.querySelectorAll('[data-action="toggle-drawer"]').forEach((btn) => {
      if (drawer) {
        btn.addEventListener("click", () => this.toggleDrawer(true));
        btn.classList.remove("hidden");
      }
    });
    document.querySelectorAll('[data-action="close"]').forEach((btn) => {
      btn.addEventListener("click", () => this.toggleDrawer(false));
    });

    window.addEventListener("scroll", () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    window.addEventListener("resize", () => {
      this.headerHeight = this.el.offsetHeight;
      this._publishHeaderHeight();
    });

    this.handleScroll();
  }

  toggleDrawer(open) {
    const drawer = this.el.querySelector(".header-drawer");
    if (!drawer) return;

    if (open) {
      drawer.classList.add("is-open");
      document.body.classList.add("overflow-hidden");
    } else {
      drawer.classList.remove("is-open");
      document.body.classList.remove("overflow-hidden");
    }
  }

  handleScroll() {
    const y = window.scrollY;
    const state = evaluateHeaderState(
      { y, prevY: this.lastScrollY, headerHeight: this.headerHeight },
      this.config
    );

    if (state.transparent !== null) {
      this.el.classList.toggle("is-transparent", state.transparent);
    }
    if (state.hidden !== null) {
      this.el.classList.toggle("-translate-y-full", state.hidden);
    }

    if (y >= 0) this.lastScrollY = y;
  }
}
