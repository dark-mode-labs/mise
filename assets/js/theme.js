document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. EAGER INITIALIZATION FOR JS BEHAVIORS
  // Bypasses the observer so display:none elements still construct immediately.
  // =========================================================================
  const behaviorElements = document.querySelectorAll('[data-behavior]');

  behaviorElements.forEach(el => {
    const behavior = el.dataset.behavior;
    if (behavior && !el.dataset.loaded) {
      loadComponent(behavior, el);
    }
  });


  // =========================================================================
  // 2. INTERSECTION OBSERVER FOR VISUAL ANIMATIONS ONLY
  // =========================================================================
  const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .scale-in, .stagger-load');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      // Trigger CSS animations
      element.classList.add('animate');

      // We no longer handle JS loading here
      observer.unobserve(element);
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
});


// =========================================================================
// 3. MODULE LOADER
// =========================================================================
const moduleCache = {};

async function loadComponent(name, element) {
  try {
    // Dynamic import handles the network request async automatically
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