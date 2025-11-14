/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',    // أسود حالك
        secondary: '#ffffff',   // أبيض نقي
        accent: '#ee5239',     // برتقالي مائل للأحمر
        'accent-light': '#ee5239', // برتقالي مائل للأحمر
        header: '#182441', // لون الهيدر المطلوب توحيده
        'gold-dark': '#ee5239', // برتقالي مائل للأحمر
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};