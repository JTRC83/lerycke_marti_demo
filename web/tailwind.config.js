/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand: dark forest green, premium palette
        brand: {
          50: '#eef3f0',
          100: '#d4e2da',
          200: '#a8c5b5',
          300: '#7da890',
          400: '#528b6c',
          500: '#3a6b4d',
          600: '#335f44',
          700: '#2d5a3f',
          800: '#264b35',
          900: '#1a3a2a',
        },
        // Neutral surface tones
        surface: {
          base: '#f7f7f5',
          card: '#ffffff',
          muted: '#9aa0a6',
        },
        // Semantic states
        state: {
          success: '#2d5a3f',
          warning: '#b8860b',
          danger: '#a23b2c',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}