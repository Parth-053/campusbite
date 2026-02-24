/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1C4E80',  
          light: '#2F6DA6',
          dark: '#123B5D',
        },
        success: {
          DEFAULT: '#1FA463',  
          light: '#DFF6EA',
        },
        alert: {
          DEFAULT: '#F97316', 
          light: '#FFF1E6',
        },
        error: {
          DEFAULT: '#DC2626', 
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#FACC15',  
        },
        background: '#F4F6F9',  
        surface: '#FFFFFF',  
        sidebar: '#0F172A',  
        textDark: '#111827',  
        textLight: '#6B7280',  
        borderCol: '#E5E7EB',  
      }
    },
  },
  plugins: [],
}