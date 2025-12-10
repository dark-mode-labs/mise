/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './blocks/*.liquid',
    './templates/*.json',
    './config/*.json',
    './assets/css/theme.css'
  ],
  theme: {
    extend: {
      height: {
        'screen-dvh': '100dvh',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        btn: ['var(--font-button)', 'sans-serif'],
      },
      maxWidth: {
        narrow: 'var(--narrow-width)',
        standard: 'var(--standard-width)',
        wide: 'var(--wide-width)',
        full: 'var(--full-width)',
      },
      spacing: {
        gap: 'var(--grid-gap)',
      },
      textColor: {
        body: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        btn: 'var(--color-btn-text)',
      },
      backgroundColor: {
        body: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        btn: 'var(--color-btn-bg)',
      },
      borderColor: {
        std: 'var(--color-border)',
        body: 'var(--color-text)',
        accent: 'var(--color-accent)',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(var(--color-shadow) / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(var(--color-shadow) / 0.1), 0 1px 2px -1px rgb(var(--color-shadow) / 0.1)',
        md: '0 4px 6px -1px rgb(var(--color-shadow) / 0.1), 0 2px 4px -2px rgb(var(--color-shadow) / 0.1)',
        lg: '0 10px 15px -3px rgb(var(--color-shadow) / 0.1), 0 4px 6px -4px rgb(var(--color-shadow) / 0.1)',
        xl: '0 20px 25px -5px rgb(var(--color-shadow) / 0.1), 0 8px 10px -6px rgb(var(--color-shadow) / 0.1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        }
      },
      animation: {
        marquee: 'marquee linear infinite',
        'marquee-reverse': 'marquee-reverse linear infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ken-burns': 'ken-burns 20s ease-out infinite alternate',
      },
      zIndex: {
        // The Mise Layer System
        'negative': '-1',
        'base': '0',
        'media': '10',    // Background images/video
        'content': '20',  // Text, buttons, standard blocks
        'floating': '30', // Pinned elements inside a section (Marquees, badges)
        'header': '40',   // Sticky site header
        'overlay': '50',  // Slide-out drawers/cart
        'modal': '60',    // Centered popups
        'toast': '70',    // Notifications
      },
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
        '2xl': '1360px',
        '3xl': '1496px',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}