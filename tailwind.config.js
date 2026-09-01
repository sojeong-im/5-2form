/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'order-bg': '#f8f4e6',
        'order-line': '#a39f90',
        'order-text': '#2c2c2c',
        'order-red': '#d32f2f',
      },
      fontFamily: {
        'sans': ['Pretendard', 'sans-serif'],
        'handwriting': ['"Gowun Dodum"', 'sans-serif'], // Or we can use Nanum Pen Script
      }
    },
  },
  plugins: [],
}
