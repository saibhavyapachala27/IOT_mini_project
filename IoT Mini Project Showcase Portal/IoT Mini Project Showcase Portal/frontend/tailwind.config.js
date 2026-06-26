/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#dcdcdc',
          300: '#b2b2b2',
          400: '#808080',
          500: '#4d4d4d',
          600: '#333333',
          700: '#222222',
          800: '#141414',
          900: '#0a0a0a',
          950: '#000000', // Primary background
        },
        cyan: {
          50: '#e6fff5',
          100: '#b3ffd7',
          200: '#80ffb8',
          300: '#4dffa1',
          400: '#00ff9d', // Neon mint green
          500: '#00e68e', // Hover state
          600: '#00b36e',
          700: '#00804e',
          800: '#004d2f',
          900: '#00331f',
          950: '#001a0e',
        },
      },
    },
  },
  plugins: [],
}
