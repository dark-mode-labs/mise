export default class Slideshow {
  constructor(element) {
    this.el = element;
    this.track = this.el.querySelector('.slideshow-track');
    this.prevBtn = this.el.querySelector('.slideshow-prev');
    this.nextBtn = this.el.querySelector('.slideshow-next');
    this.dots = this.el.querySelectorAll('.slideshow-dot');

    this.infinite = this.el.dataset.infinite === 'true';
    this.autoplayEnabled = this.el.dataset.autoplay === 'true';
    this.speed = (parseInt(this.el.dataset.speed) || 5) * 1000;

    this.interval = null;
    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;

    this.init();
  }

  init() {
    if (!this.track) return;

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        this.scrollToIndex(parseInt(dot.dataset.index));
        this.stopAutoplay();
      });
    });

    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      root: this.track, threshold: 0.5
    });
    Array.from(this.track.children).forEach(slide => this.observer.observe(slide));

    this.initDragPhysics();

    if (this.autoplayEnabled) {
      this.startAutoplay();
      this.el.addEventListener('mouseenter', () => this.stopAutoplay());
      this.el.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slides = Array.from(this.track.children);
        const index = slides.indexOf(entry.target);
        this.updateUI(index, slides.length);
      }
    });
  }

  updateUI(index, total) {
    this.dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));

    if (!this.infinite) {
      if (this.prevBtn) this.prevBtn.disabled = index === 0;
      if (this.nextBtn) this.nextBtn.disabled = index === total - 1;
    }
  }

  next() {
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;
    const current = this.track.scrollLeft;

    if (current >= maxScroll - 10) {
      if (this.infinite) this.track.scrollTo({ left: 0, behavior: 'smooth' }); // Rewind
    } else {
      this.track.scrollBy({ left: this.track.clientWidth, behavior: 'smooth' });
    }
    this.stopAutoplay();
  }

  prev() {
    const current = this.track.scrollLeft;

    if (current <= 10) {
      if (this.infinite) this.track.scrollTo({ left: this.track.scrollWidth, behavior: 'smooth' }); // Jump to end
    } else {
      this.track.scrollBy({ left: -this.track.clientWidth, behavior: 'smooth' });
    }
    this.stopAutoplay();
  }

  scrollToIndex(index) {
    const slide = this.track.children[index];
    if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  startAutoplay() {
    this.stopAutoplay();
    this.interval = setInterval(() => this.next(), this.speed);
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  initDragPhysics() {
    this.track.addEventListener('mousedown', (e) => {
      this.isDown = true;
      this.track.classList.add('cursor-grabbing');
      this.track.classList.remove('scroll-smooth', 'snap-x');
      this.startX = e.pageX - this.track.offsetLeft;
      this.scrollLeft = this.track.scrollLeft;
      this.stopAutoplay();
    });

    this.track.addEventListener('mouseleave', () => this.endDrag());
    this.track.addEventListener('mouseup', () => this.endDrag());

    this.track.addEventListener('mousemove', (e) => {
      if (!this.isDown) return;
      e.preventDefault();
      const x = e.pageX - this.track.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.track.scrollLeft = this.scrollLeft - walk;
    });
  }

  endDrag() {
    this.isDown = false;
    this.track.classList.remove('cursor-grabbing');
    this.track.classList.add('scroll-smooth', 'snap-x');
    if (this.autoplayEnabled) this.startAutoplay();
  }
}