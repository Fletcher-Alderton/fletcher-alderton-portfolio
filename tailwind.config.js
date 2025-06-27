/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Viewport-based shape breakpoints
        // Portrait/tall screens (height > width * 1.33)
        'shape-tall': { 'raw': '(max-width: 768px) and (orientation: portrait)' },
        // Square-ish screens (roughly equal width/height)
        'shape-standard': { 'raw': '(min-width: 769px) and (max-width: 1200px) and (max-height: 900px)' },
        // Wide screens (width > height * 1.5)
        'shape-wide': { 'raw': '(min-width: 1201px) and (max-aspect-ratio: 21/9)' },
        // Ultrawide screens (width > height * 2.33)
        'shape-ultrawide': { 'raw': '(min-aspect-ratio: 21/9)' },
      },
      fontFamily: {
        'serif': ['Instrument Serif', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 