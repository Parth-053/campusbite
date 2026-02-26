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
          DEFAULT: '#1E63B5',
          light: '#4A8FE7',
        }, 
        accent: {
          DEFAULT: '#FF6B00',
          hover: '#E85D00',
        }, 
        success: '#2BB673', 
        warning: '#FFC83D',
         
        background: '#F8FAFC',
        surface: '#FFFFFF',
        borderCol: '#E5E7EB',
        
        // Typography
        textDark: '#1F2937',
        textLight: '#6B7280',
      },
      backgroundImage: { 
        'gradient-hero': 'linear-gradient(135deg, #1E63B5, #FF6B00)',
        'gradient-offer': 'linear-gradient(135deg, #FF6B00, #FFC83D)',
      },
      boxShadow: { 
        'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'floating': '0 10px 25px rgba(255, 107, 0, 0.25)', 
        'header': '0 2px 10px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'bounce-slight': 'bounceSlight 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSlight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}