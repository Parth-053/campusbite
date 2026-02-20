/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',   // Red color (adjust hex code to your actual brand color)
        secondary: '#14b8a6', // Teal color 
        dark: '#1f2937',      // Dark Gray/Black
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    }
  },
  plugins: [],
}