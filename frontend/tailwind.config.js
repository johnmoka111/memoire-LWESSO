/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",   // Indigo (Actions)
        secondary: "#1E1B4B", // Navy (Backgrounds/Cards)
        dark: "#0a0a0c",      // Deep Black (Main Background)
        slate: {
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
