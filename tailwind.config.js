/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB3D9',
        'pastel-mint': '#B3E5D9',
        'pastel-lavender': '#D9B3FF',
        'pastel-peach': '#FFD9B3',
        'pastel-sky': '#B3D9FF',
      },
    },
  },
  plugins: [],
}
