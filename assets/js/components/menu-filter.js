export default class MenuFilter {
  constructor(element) {
    this.bar = element;
    this.scope = this.bar.closest('[data-filter-scope]');
    if (!this.scope) return;

    this.input = this.bar.querySelector('[data-filter-search]');
    this.tagButtons = this.bar.querySelectorAll('[data-filter-tag]');
    this.clearBtn = this.scope.querySelector('[data-action="clear-filters"]');
    this.emptyState = this.scope.querySelector('#filter-empty-state');

    this.navLinks = this.scope.querySelectorAll('[data-filter-nav]');
    this.grids = this.scope.querySelectorAll('[data-filter-grid]');

    this.items = Array.from(this.scope.querySelectorAll('[data-filter-item]')).map(el => ({
      element: el,
      name: el.querySelector('h3, h4').innerText.toLowerCase(),
      description: el.querySelector('.opacity-70')?.innerText.toLowerCase() || '',
      tags: el.dataset.tags ? el.dataset.tags.split(',') : [],
      section: el.closest('[data-filter-section]')
    }));

    this.sections = Array.from(this.scope.querySelectorAll('[data-filter-section]'));

    this.state = {
      search: '',
      activeTags: new Set(),
      isFiltering: false
    };

    this.init();
  }

  init() {
    if (this.input) {
      this.input.addEventListener('input', (e) => {
        this.state.search = e.target.value.toLowerCase();
        this.updateFilteringState();
        this.applyFilters();
      });
    }

    this.tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.filterTag;

        if (this.state.activeTags.has(tag)) {
          this.state.activeTags.delete(tag);
          btn.classList.remove('is-active');
        } else {
          this.state.activeTags.add(tag);
          btn.classList.add('is-active');
        }

        this.updateFilteringState();
        this.applyFilters();
      });
    });

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.reset();
      });
    }
  }

  updateFilteringState() {
    this.state.isFiltering = (this.state.search.length > 0 || this.state.activeTags.size > 0);

    if (this.state.isFiltering) {
      this.grids.forEach(grid => grid.classList.remove('stagger-load'));
    }
  }

  reset() {
    this.state.search = '';
    this.state.activeTags.clear();
    if (this.input) this.input.value = '';
    this.tagButtons.forEach(btn => btn.classList.remove('is-active'));
    this.updateFilteringState();
    this.applyFilters();
  }

  applyFilters() {
    let visibleItemCount = 0;

    this.items.forEach(item => {
      const matchesSearch = !this.state.search ||
        item.name.includes(this.state.search) ||
        item.description.includes(this.state.search);

      const matchesTags = this.state.activeTags.size === 0 ||
        [...this.state.activeTags].every(t => item.tags.includes(t));

      const isVisible = matchesSearch && matchesTags;

      if (isVisible) {
        item.element.style.display = '';
        visibleItemCount++;
      } else {
        item.element.style.display = 'none';
      }
    });

    this.sections.forEach(section => {
      const hasVisibleChildren = section.querySelector('[data-filter-item]:not([style*="display: none"])') !== null;

      section.style.display = hasVisibleChildren ? '' : 'none';

      const sectionId = section.dataset.filterSectionId;
      if (sectionId) {
        const navLink = this.scope.querySelector(`[data-filter-nav="${sectionId}"]`);
        if (navLink) {
          navLink.style.display = hasVisibleChildren ? '' : 'none';
        }
      }
    });

    if (this.emptyState) {
      this.emptyState.classList.toggle('hidden', visibleItemCount > 0);
    }

    window.dispatchEvent(new Event('scroll'));
  }
}