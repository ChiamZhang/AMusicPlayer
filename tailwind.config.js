/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f2f5fb',
          100: '#e6ebf7',
          200: '#cfd8ee',
          300: '#b6c1e4',
          400: '#98a6d5',
          500: '#798FC1',
          600: '#6479a8',
          700: '#4f6086',
          800: '#3d4a67',
          900: '#2b3448'
        },
        emerald: {
          50: '#f2f6fd',
          100: '#e5edfb',
          200: '#c8d6f3',
          300: '#a8bde9',
          400: '#86a2dc',
          500: '#6a87ce',
          600: '#5671b8',
          700: '#435894',
          800: '#33406c',
          900: '#222b47'
        },
        primary: {
          DEFAULT: '#000',
          light: '#fff',
          dark: '#000'
        },
        secondary: {
          DEFAULT: '#6c757d',
          light: '#8c959e',
          dark: '#495057'
        },
        dark: {
          DEFAULT: '#000',
          100: '#161616',
          200: '#2d2d2d',
          300: '#3d3d3d'
        },
        light: {
          DEFAULT: '#fff',
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6'
        }
      }
    }
  },
  plugins: []
};
