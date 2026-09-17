/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8F3',
        brand: {
          50: '#FFF3E9',
          100: '#FFE4CF',
          200: '#FECFA8',
          300: '#FDAF74',
          400: '#FB8A3F',
          500: '#F57020',
          600: '#E0560A',
          700: '#B9410A',
        },
        sage: {
          50: '#EFFAF4',
          100: '#D7F3E2',
          400: '#4FBC83',
          500: '#2FA46B',
          600: '#1F8556',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
