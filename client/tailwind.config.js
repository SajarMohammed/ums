/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
     screens:{
      'mm':'400px',
      'tablet':'640px',
      'laptop':'1024px',
       'monitor': '1800px',
       'lcd':'2400px'
     }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

