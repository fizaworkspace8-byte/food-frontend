/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#0d0f12',
        'text-main': '#f4f4f5',
        'accent-color': '#ff4500'
      }
    },
  },
  plugins: [],
}
