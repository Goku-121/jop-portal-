/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',     // indigo-500
        primaryDark: '#4f46e5',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}