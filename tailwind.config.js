/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-background': '#1A1A2E', // Deep black/dark purple
        'dark-card': '#22223B',      // Slightly lighter dark for cards
        'primary-purple': '#6A057F', // Main purple
        'secondary-purple': '#8E05A4', // Lighter purple for accents/hover
        'text-light': '#E0E0E0',     // Light text on dark background
        'text-dim': '#A0A0A0',       // Dimmed text
        'danger-red': '#DC2626',     // For error messages
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideInDown: 'slideInDown 0.4s ease-out',
        scaleUp: 'scaleUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}