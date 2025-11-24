/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './blocks/*.liquid',
    './templates/*.json',
    './config/*.json'
  ],
  theme: {
    extend: {
      height: {
        'screen-dvh': '100dvh',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      textColor: {
        body: 'var(--color-text)',
        btn: 'var(--color-btn-text)',
      },
      backgroundColor: {
        body: 'var(--color-bg)',
        btn: 'var(--color-btn-bg)',
      },
      borderColor: {
        std: 'var(--color-border)',
        body: 'var(--color-text)',
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
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
        },
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
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}