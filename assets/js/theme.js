document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. EAGER INITIALIZATION FOR JS BEHAVIORS
  // Bypasses the observer so display:none elements still construct immediately.
  // =========================================================================
  bootstrapBehaviorsIn(document);

  // =========================================================================
  // 2. INTERSECTION OBSERVER FOR VISUAL ANIMATIONS ONLY
  // =========================================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      // Trigger CSS animations
      element.classList.add("animate");

      // We no longer handle JS loading here
      observer.unobserve(element);
    });
  }, observerOptions);

  const EFFECT_SELECTOR = '[class^="ef-"], [class*=" ef-"]';

  // Armed per inserted subtree, not once per document: an effect nobody observes stays at opacity 0.
  function armEffectsIn(root) {
    const found = [];
    if (root.nodeType === 1 && root.matches?.(EFFECT_SELECTOR)) found.push(root);
    found.push(...(root.querySelectorAll?.(EFFECT_SELECTOR) || []));

    found.forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.animationName === "none" && cs.opacity === "0") observer.observe(el);
    });
  }

  armEffectsIn(document);

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        bootstrapBehaviorsIn(node);
        armEffectsIn(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
});

// =========================================================================
// 3. MODULE LOADER
// =========================================================================
const moduleCache = {};

function bootstrapBehaviorsIn(root) {
  if (root.nodeType === 1 && root.matches?.("[data-behavior]") && !root.dataset.loaded) {
    loadComponent(root.dataset.behavior, root);
  }
  const descendants = root.querySelectorAll?.("[data-behavior]");
  if (!descendants) return;
  descendants.forEach((el) => {
    if (!el.dataset.loaded) loadComponent(el.dataset.behavior, el);
  });
}

async function loadComponent(name, element) {
  try {
    // Dynamic import handles the network request async automatically
    if (!moduleCache[name]) {
      moduleCache[name] = await import(`./components/${name}.js`);
    }

    const ComponentClass = moduleCache[name].default;
    new ComponentClass(element);

    element.dataset.loaded = "true";
  } catch (error) {
    console.error(`[Mise] Failed to load behavior: ${name}`, error);
  }
}
