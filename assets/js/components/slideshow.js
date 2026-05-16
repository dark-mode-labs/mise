import {
  computeExactSlideWidth,
  getPageCount,
  getCurrentPageFromIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
  clampPageIndex,
} from "../lib/slideshow-math.js";

export default class Slideshow {
  constructor(element) {
    this.el = element;
    this.track = this.el.querySelector(".slideshow-track");
    this.controls = this.el.querySelector(".slideshow-controls");
    this.prevBtn = this.el.querySelector(".slideshow-prev");
    this.nextBtn = this.el.querySelector(".slideshow-next");
    this.dotsContainer = this.el.querySelector(".slideshow-dots");
    this.dots = [];

    this.counter =
      this.el.querySelector(".slideshow-counter-wrapper span") ||
      this.el.querySelector(".slideshow-counter-wrapper");

    this.infinite = this.el.dataset.infinite === "true";
    this.autoplayEnabled = this.el.dataset.autoplay === "true";
    this.speed = (parseInt(this.el.dataset.speed) || 5) * 1000;

    this.interval = null;
    this.isDown = false;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;

    this.scrollTicking = false;

    this.init();
  }

  // Returns the RAW configured column count for consistent sizing and logic
  getCols() {
    const isMobile = this.el.clientWidth < 540;
    return parseInt(this.el.dataset[isMobile ? "colsMobile" : "colsDesktop"]) || 1;
  }

  initExactFit() {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const wrapperWidth = entry.contentRect.width;
        const isMobile = wrapperWidth < 540;
        const cols = this.getCols();
        const peekPct =
          parseInt(this.el.dataset[isMobile ? "peekMobile" : "peekDesktop"]) / 100 || 0;
        const gapPx = parseFloat(window.getComputedStyle(this.track).columnGap) || 0;

        const exactWidth = computeExactSlideWidth(wrapperWidth, cols, peekPct, gapPx);
        this.el.style.setProperty("--computed-slide-width", `${exactWidth}px`);

        this.updateUI(this.getCurrentIndex(), this.getSlides().length);
      }
    });

    observer.observe(this.el);
  }

  getSlides() {
    if (!this.track) return [];
    return Array.from(
      this.track.querySelectorAll(":scope > *:not(.contents), :scope > .contents > *")
    );
  }

  getCurrentIndex() {
    const scrollPos = this.track.scrollLeft;
    const slides = this.getSlides();
    let closestIndex = 0;
    let minDiff = Infinity;

    slides.forEach((slide, index) => {
      const slideLeft = slide.offsetLeft - this.track.offsetLeft;
      const diff = Math.abs(slideLeft - scrollPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  renderDots() {
    if (!this.dotsContainer) return;
    const slideCount = this.getSlides().length;
    if (slideCount === 0) return;
    const pageCount = getPageCount(slideCount, this.getCols());
    const style = this.dotsContainer.dataset.dotStyle || "dots";
    const html = [];
    for (let i = 0; i < pageCount; i++) {
      const inner =
        style === "bars"
          ? `<span class='slideshow-dot-pill block w-8 h-1 rounded-sm opacity-50 hover:opacity-100'></span>`
          : style === "numbers"
            ? `<span class='slideshow-dot-num text-sm font-bold opacity-50'>${i + 1}</span>`
            : `<span class='slideshow-dot-pill block w-2.5 h-2.5 rounded-full opacity-50 hover:opacity-100 ring-1 ring-transparent'></span>`;
      html.push(
        `<button type='button' class='slideshow-dot transition-all duration-300' data-index='${i}' aria-label='Go to page ${i + 1}'>${inner}</button>`
      );
    }
    this.dotsContainer.innerHTML = html.join("");
    this.dots = this.dotsContainer.querySelectorAll(".slideshow-dot");
  }

  init() {
    if (!this.track) return;

    this.renderDots();

    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.next());

    this.dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const cols = this.getCols();
        const targetSlideIndex = parseInt(dot.dataset.index) * cols;
        this.scrollToIndex(targetSlideIndex);
        this.stopAutoplay();
      });
    });

    this.track.addEventListener("scroll", () => {
      if (!this.scrollTicking) {
        window.requestAnimationFrame(() => {
          this.updateUI(this.getCurrentIndex(), this.getSlides().length);
          this.scrollTicking = false;
        });
        this.scrollTicking = true;
      }
    });

    this.initDragPhysics();

    if (this.autoplayEnabled) {
      this.startAutoplay();
      this.el.addEventListener("mouseenter", () => this.stopAutoplay());
      this.el.addEventListener("mouseleave", () => this.startAutoplay());
    }

    this.initExactFit();

    setTimeout(() => this.updateUI(this.getCurrentIndex(), this.getSlides().length), 50);
  }

  updateUI(index, total) {
    if (total === 0) return;

    const cols = this.getCols();
    const totalPages = getPageCount(total, cols);

    if (this.controls) {
      this.controls.style.display = totalPages <= 1 ? "none" : "flex";
    }
    this.el
      .querySelectorAll(".slideshow-nav, .slideshow-dots")
      .forEach((el) => (el.style.display = totalPages <= 1 ? "none" : ""));

    if (totalPages <= 1) {
      this.track.classList.add("justify-center");
    } else {
      this.track.classList.remove("justify-center");
    }

    const maxScroll = this.track.scrollWidth - this.track.clientWidth;

    let currentPageIndex;
    if (this.track.scrollLeft <= 10) {
      currentPageIndex = 0;
    } else if (this.track.scrollLeft >= maxScroll - 10) {
      currentPageIndex = totalPages - 1;
    } else {
      currentPageIndex = getCurrentPageFromIndex(index, cols);
    }

    currentPageIndex = clampPageIndex(currentPageIndex, totalPages);

    this.dots.forEach((dot, i) => dot.classList.toggle("is-active", i === currentPageIndex));

    if (!this.infinite) {
      if (this.prevBtn) this.prevBtn.disabled = this.track.scrollLeft <= 5;
      if (this.nextBtn) this.nextBtn.disabled = this.track.scrollLeft >= maxScroll - 5;
    }

    if (this.counter) {
      const displayPage = currentPageIndex + 1;
      this.counter.textContent = `${displayPage} / ${totalPages}`;
    }
  }

  next() {
    const total = this.getSlides().length;
    const target = getNextSlideIndex(this.getCurrentIndex(), this.getCols(), total, this.infinite);
    if (target === null) return;
    this.scrollToIndex(target);
    this.stopAutoplay();
  }

  prev() {
    const total = this.getSlides().length;
    const target = getPrevSlideIndex(this.getCurrentIndex(), this.getCols(), total, this.infinite);
    if (target === null) return;
    this.scrollToIndex(target);
    this.stopAutoplay();
  }

  scrollToIndex(index) {
    const slides = this.getSlides();
    const slide = slides[index];
    if (!slide) return;

    const targetLeft = slide.offsetLeft - this.track.offsetLeft;
    this.track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  startAutoplay() {
    this.stopAutoplay();
    const cols = this.getCols();
    const totalPages = Math.ceil(this.getSlides().length / cols);
    if (totalPages <= 1) return;

    this.interval = setInterval(() => this.next(), this.speed);
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  initDragPhysics() {
    this.track.addEventListener(
      "click",
      (e) => {
        if (this.isDragging) {
          e.preventDefault();
          e.stopPropagation();
          this.isDragging = false;
        }
      },
      true
    );

    this.track.addEventListener("mousedown", (e) => {
      this.isDown = true;
      this.isDragging = false;
      this.track.classList.add("cursor-grabbing");

      this.track.style.scrollSnapType = "none";
      this.track.style.scrollBehavior = "auto";

      this.startX = e.pageX - this.track.offsetLeft;
      this.scrollLeft = this.track.scrollLeft;
      this.stopAutoplay();
    });

    this.track.addEventListener("mouseleave", () => this.endDrag());
    this.track.addEventListener("mouseup", () => this.endDrag());

    this.track.addEventListener("mousemove", (e) => {
      if (!this.isDown) return;
      e.preventDefault();
      const x = e.pageX - this.track.offsetLeft;

      if (Math.abs(x - this.startX) > 5) {
        this.isDragging = true;
      }

      const walk = (x - this.startX) * 1.5;
      this.track.scrollLeft = this.scrollLeft - walk;
    });
  }

  endDrag() {
    if (!this.isDown) return;
    this.isDown = false;
    this.track.classList.remove("cursor-grabbing");

    this.track.style.scrollBehavior = "smooth";
    this.track.style.scrollSnapType = "x mandatory";

    if (this.isDragging) {
      const nearestIndex = this.getCurrentIndex();
      this.scrollToIndex(nearestIndex);
    }

    if (this.autoplayEnabled) this.startAutoplay();
  }
}
