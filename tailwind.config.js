/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d4ff',
          300: '#a5b8ff',
          400: '#7d91ff',
          500: '#4d6bff',
          600: '#1a44ff',
          700: '#0033ff',
          800: '#0028cc',
          900: '#001f99',
        },
      },
    },
  },
  plugins: [],
} 