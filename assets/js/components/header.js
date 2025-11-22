export default class Header {
  constructor(element) {
    this.el = element;
    this.config = {
      sticky: this.el.dataset.sticky,
      transparent: this.el.dataset.transparent === 'true'
    };

    this.lastScrollY = window.scrollY;
    this.headerHeight = this.el.offsetHeight;
    this.ticking = false;

    this.init();
  }

  init() {
    document.querySelectorAll('[data-action="toggle-drawer"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleDrawer(true));
    });
    document.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleDrawer(false));
    });

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    window.addEventListener('resize', () => {
      this.headerHeight = this.el.offsetHeight;
    });

    this.handleScroll();
  }

  toggleDrawer(open) {
    const drawer = this.el.querySelector('.header-drawer');
    if (!drawer) return;

    if (open) {
      drawer.classList.remove('-translate-x-full', 'pointer-events-none');
      document.body.classList.add('overflow-hidden');
    } else {
      drawer.classList.add('-translate-x-full', 'pointer-events-none');
      document.body.classList.remove('overflow-hidden');
    }
  }

  handleScroll() {
    const y = window.scrollY;
    const scrollDown = y > this.lastScrollY;

    if (y < 0) return;

    if (this.config.transparent) {
      const isTop = y < 20;
      if (isTop) {
        this.el.classList.add('is-transparent');
        this.el.classList.remove('bg-body', 'shadow-sm');
      } else {
        this.el.classList.remove('is-transparent');
        this.el.classList.add('bg-body', 'shadow-sm');
      }
    }

    if (this.config.sticky === 'on_scroll_up') {
      if (y > this.headerHeight && scrollDown) {
        this.el.classList.add('-translate-y-full');
      } else if (!scrollDown) {
        this.el.classList.remove('-translate-y-full');
      }
    }

    this.lastScrollY = y;
  }
}