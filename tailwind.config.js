/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#85C2FF',
          400: '#5CADFF',
          500: '#2C7BE5',
          600: '#2362B8',
          700: '#1A4A8A',
          800: '#12315C',
          900: '#09192E',
        },
        teal: {
          50: '#E6F9F7',
          100: '#CCF3EF',
          200: '#99E7DF',
          300: '#66DBCF',
          400: '#33CFBF',
          500: '#00B8A9',
          600: '#009387',
          700: '#006E65',
          800: '#004A43',
          900: '#002522',
        },
      },
    },
  },
  plugins: [],
};
