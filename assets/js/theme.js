/**
 * MISE DYNAMIC LOADER
 * Automatically hydrates components when they enter the viewport.
 */

document.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('[data-behavior]');
  
  // 1. The Intersection Observer (Scroll Spy)
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const behavior = element.dataset.behavior;
        
        // 2. Load the component
        loadComponent(behavior, element);
        
        // 3. Stop watching this element (it's loaded)
        observer.unobserve(element);
      }
    });
  }, { rootMargin: '200px' }); // Pre-load when 200px away from view

  // Start watching all components
  components.forEach(el => observer.observe(el));
});

// Cache loaded modules to prevent double-fetching
const moduleCache = {};

async function loadComponent(name, element) {
  try {
    // Check cache first
    if (!moduleCache[name]) {
      // 4. Dynamic Import Magic
      // This tells the bundler: "Split these files into separate chunks"
      // Note: The path must be relative and specific for bundlers to find it.
      moduleCache[name] = await import(`./components/${name}.js`);
    }

    const ComponentClass = moduleCache[name].default;
    
    // 5. Instantiate
    new ComponentClass(element);
    
    // Optional: Mark as loaded for CSS styling hooks
    element.dataset.loaded = 'true';
    
  } catch (error) {
    console.error(`[Mise] Failed to load behavior: ${name}`, error);
  }
}