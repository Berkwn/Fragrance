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
        "primary": "#7f13ec",
        "primary-dark": "#5e0eb0",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
        "surface-dark": "#1e1a24",      // Güncellendi (HTML'den alındı)
        "surface-highlight": "#302839", // YENİ EKLENDİ
        "card-dark": "#231a2e",
        "card-hover": "#2d213a",
        "border-dark": "#473b54",
        "text-muted": "#ab9db9"
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"], // YENİ EKLENDİ
      },
      animation: {
         'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}