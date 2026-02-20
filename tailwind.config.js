/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF8E7',
          100: '#FFEFC1',
          200: '#FFE699',
          300: '#F5D78E',
          400: '#E5C76F',
          500: '#D4AF37',
          600: '#C9A961',
          700: '#B8860B',
          800: '#A67C00',
          900: '#8B6914',
        },
        warm: {
          50: '#FFF8F0',
          100: '#FFEEDD',
          200: '#FFE4CC',
          300: '#F5DEB3',
          400: '#DEB887',
          500: '#D2B48C',
          600: '#BC8F8F',
          700: '#A0522D',
          800: '#8B4513',
          900: '#6B3410',
        },
        cream: '#F5F5DC',
        ivory: '#FFFFF0',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
