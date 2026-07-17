/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./layout/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./blocks/*.liquid",
    "./templates/*.json",
    "./config/*.json",
    "./assets/css/theme.css",
    "./assets/js/**/*.js",
  ],
  safelist: [
    "backdrop-blur-sm",
    "backdrop-blur-md",
    "backdrop-blur-lg",
    "backdrop-blur-xl",
    "backdrop-blur-2xl",
    "backdrop-blur-3xl",
    "anim-fade-in",
    "anim-rise-in",
    "anim-float",
    "anim-pulse",
    "anim-zoom-in",
    "anim-ken-burns",
    "anim-rise",
    "anim-shimmer",
    "anim-spin",
    "anim-bounce",
    "anim-speed-slow",
    "anim-speed-normal",
    "anim-speed-fast",
    "anim-loop-once",
    "anim-loop-loop",
    "anim-loop-loop-alternate",
    "anim-intensity-subtle",
    "anim-intensity-normal",
    "anim-intensity-strong",
    "anim-delay-short",
    "anim-delay-long",
  ],
  theme: {
    extend: {
      height: {
        "screen-dvh": "100dvh",
      },
      boxShadow: {
        sm: "0 1px 2px 0 var(--shadow)",
        default: "0 1px 3px 0 var(--shadow), 0 1px 2px -1px var(--shadow)",
        md: "0 4px 6px -1px var(--shadow), 0 2px 4px -2px var(--shadow)",
        lg: "0 10px 15px -3px var(--shadow), 0 4px 6px -4px var(--shadow)",
        xl: "0 20px 25px -5px var(--shadow), 0 8px 10px -6px var(--shadow)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee linear infinite",
        "marquee-reverse": "marquee-reverse linear infinite",
      },
      zIndex: {
        // The Mise Layer System
        negative: "-1",
        base: "0",
        media: "10", // Background images/video
        content: "20", // Text, buttons, standard blocks
        floating: "30", // Pinned elements inside a section (Marquees, badges)
        header: "40", // Sticky site header
        "header-top": "45", // Announcement bar above header
        overlay: "50", // Slide-out drawers/cart
        modal: "60", // Centered popups
        toast: "70", // Notifications
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
