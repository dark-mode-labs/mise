// A control naming `marquee-toggle` holds the band's track still, says so, and shows the label its action carries.
export default class Marquee {
  constructor(section) {
    const controls = () => section.querySelectorAll('[data-action="marquee-toggle"]');
    controls().forEach((control) => control.setAttribute("aria-pressed", "false"));
    section.addEventListener("click", (event) => {
      const control = event.target.closest('[data-action="marquee-toggle"]');
      if (!control || !section.contains(control)) return;
      const paused = !section.hasAttribute("data-paused");
      section.toggleAttribute("data-paused", paused);
      controls().forEach((c) => {
        c.setAttribute("aria-pressed", String(paused));
        const label = labelText(c);
        if (!label) return;
        if (c.dataset.restingLabel === undefined) c.dataset.restingLabel = label.data;
        label.data = paused && c.dataset.actionArgs ? c.dataset.actionArgs : c.dataset.restingLabel;
      });
    });
  }
}

function labelText(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.data.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  return walker.nextNode();
}
