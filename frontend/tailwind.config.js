/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEF5',
          100: '#FFFAEB',
          200: '#FFF4D1',
        },
        beige: {
          50: '#FAF8F3',
          100: '#F5F1E8',
          200: '#EBE4D5',
        },
        blue: {
          300: '#A8C5E8',
          400: '#7BA7D9',
          500: '#5B8FCC',
        },
        purple: {
          400: '#9B8FC9',
          500: '#7B6BAC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}