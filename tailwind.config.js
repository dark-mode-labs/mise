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
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },

      // 3. Color Palette: Maps Tailwind utilities to Scheme Variables
      colors: {
        // Usage: bg-body, text-body, border-std
        // These rely on the variables existing in the DOM (injected by snippet)
        // Note: We define specific properties to handle the 'body' naming conflict
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
        body: 'var(--color-text)', // Useful for outline buttons
      },

      // 4. Animations: For Marquee Block
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        // Usage: animate-marquee
        marquee: 'marquee linear infinite',
      },

      // 5. Spacing/Layout extensions
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px', // Capping width for readability
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require('@tailwindcss/forms'),
  ],
}