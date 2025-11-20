export default class Header {
  constructor(element) {
    this.el = element;
    this.config = {
      sticky: this.el.dataset.sticky,
      transparent: this.el.dataset.transparent === 'true'
    };
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    // Mobile Drawer Toggles
    document.querySelectorAll('[data-action="toggle-drawer"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleDrawer(true));
    });
    
    document.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleDrawer(false));
    });

    // Scroll Loop
    window.addEventListener('scroll', () => requestAnimationFrame(() => this.handleScroll()));
    this.handleScroll(); // Init check
    this.handleBodyPadding()
  }

  toggleDrawer(open) {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (!drawer) return;
    
    if (open) {
      drawer.classList.remove('-translate-x-full', 'pointer-events-none');
      document.body.classList.add('overflow-hidden');
    } else {
      drawer.classList.add('-translate-x-full', 'pointer-events-none');
      document.body.classList.remove('overflow-hidden');
    }
  }

  handleBodyPadding() {
    if (this.config.transparent) {
      // If transparent, we WANT it to overlap content. No padding.
      document.body.style.paddingTop = '0px';
    } else {
      // If sticky & solid, push content down so it doesn't hide behind header
      const height = this.el.offsetHeight;
      document.body.style.paddingTop = `${height}px`;
    }
  }

  handleScroll() {
    const y = window.scrollY;
    const isTop = y < 20;
    const isDown = y > this.lastScrollY;

    // 1. TRANSPARENCY LOGIC
    if (this.config.transparent) {
      if (isTop) {
        this.el.classList.add('is-transparent');
        this.el.classList.remove('bg-[var(--header-bg)]', 'shadow-sm');
      } else {
        this.el.classList.remove('is-transparent');
        this.el.classList.add('bg-[var(--header-bg)]', 'shadow-sm');
      }
    }

    // 2. STICKY LOGIC
    if (this.config.sticky === 'on_scroll_up') {
      // Hide on scroll down, show on scroll up (unless at top)
      if (isDown && !isTop) {
        this.el.classList.add('-translate-y-full');
      } else {
        this.el.classList.remove('-translate-y-full');
      }
    }
    
    this.lastScrollY = y;
  }
}