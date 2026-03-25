/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['InterCustom', 'sans-serif'],
        jetbrains: ['JetBrainsCustom', 'monospace'],
      },
    },
  },
  plugins: [require('daisyui')],
}

