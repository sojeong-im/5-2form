/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'order-bg': '#FFFBF0',
        'order-line': '#D4C9B3',
        'order-text': '#2c2c2c',
        'order-red': '#E63946', // Chili Red
        'order-yellow': '#F4A261', // Mustard Yellow
        'order-green': '#2A9D8F', // Basil Green
      },
      fontFamily: {
        'sans': ['Pretendard', 'sans-serif'],
        'handwriting': ['"Nanum Pen Script"', 'cursive'], 
        'marker': ['"Jua"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
