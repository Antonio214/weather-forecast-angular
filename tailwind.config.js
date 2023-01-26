/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'blue': '#0636D4',
      'white': '#FDFDFD',
      'light-gray': '#3E5376',
      'dark-gray': '#131927',
      'yellow': '#FEBF02',
      'pink': '#F37EAB'
    },
    extend: {
      fontFamily: {
        'sora': ['Sora', 'sans-serif']
      }
    },
  },
  plugins: [],
}