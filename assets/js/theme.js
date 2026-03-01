document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-behavior], .fade-up, .fade-in, .scale-in, .stagger-load');

   const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      if (element.matches('[class*="fade-"], [class*="scale-"], .float, .stagger-load')) {
        element.classList.add('animate');
      }

      const behavior = element.dataset.behavior;
      if (behavior && !element.dataset.loaded) {
        loadComponent(behavior, element);
      }

      observer.unobserve(element);
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
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