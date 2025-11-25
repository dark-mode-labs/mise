document.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('[data-behavior]');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const behavior = element.dataset.behavior;

        loadComponent(behavior, element);

        observer.unobserve(element);
      }
    });
  }, { rootMargin: '200px' }); // Pre-load when 200px away from view

  components.forEach(el => observer.observe(el));
});

// Cache loaded modules to prevent double-fetching
const moduleCache = {};

async function loadComponent(name, element) {
  try {
    // Check cache first
    if (!moduleCache[name]) {
      moduleCache[name] = await import(`./components/${name}.js`);
    }

    const ComponentClass = moduleCache[name].default;

    new ComponentClass(element);

    element.dataset.loaded = 'true';

  } catch (error) {
    console.error(`[Mise] Failed to load behavior: ${name}`, error);
  }
}