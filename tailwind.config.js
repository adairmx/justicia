/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        legal: {
          900: '#0b0f19',
          800: '#111827',
          700: '#1f2937',
          gold: '#d97706',
          goldLight: '#f59e0b',
          accent: '#3b82f6',
          success: '#10b981',
          danger: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
