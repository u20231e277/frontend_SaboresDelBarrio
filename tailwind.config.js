/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          terra: '#E2725B',   // Terracotta (warm, reddish-orange)
          wood: '#8B5A2B',    // Wood (rich brown)
          dark: '#3E2723',    // Dark Wood (deep brown for text)
          cream: '#FDF5E6',   // Warm White / Cream
          light: '#FFF8E1',   // Lighter Cream
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
