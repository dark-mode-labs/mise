export default class PageCanvas {
  constructor(el) {
    const layer = el.querySelector(":scope > div");
    if (!layer) return;

    const { backgroundColor, backgroundImage } = getComputedStyle(layer);
    const root = document.documentElement.style;

    if (backgroundColor !== "rgba(0, 0, 0, 0)") root.backgroundColor = backgroundColor;
    if (backgroundImage !== "none") root.backgroundImage = backgroundImage;
  }
}
