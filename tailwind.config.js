/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Maison Neue Extended', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#1f3142',
          dark: '#2d4560',
          light: '#dedbd5',
        },
      },
      keyframes: {
        pulseStrong: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
      },
      animation: {
        'pulse-strong': 'pulseStrong 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}