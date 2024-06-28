/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      fontFamily: {
        nintendo: ['Nintendo', 'sans-serif'],
        montserrat: ['MontserratAlternates-Regular', 'sans-serif'],
      },
      colors: {
        dark: '#37383B',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
