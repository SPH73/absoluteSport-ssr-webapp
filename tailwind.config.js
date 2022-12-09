
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  'components/**/*.{vue,js,ts}',
  'layouts/**/*.vue',
  'pages/**/*.vue',
  'composables/**/*.{js,ts}',
  'plugins/**/*.{js,ts}',
  'App.{js,ts,vue}',
  'app.{js,ts,vue}',
  'Error.{js,ts,vue}',
  'error.{js,ts,vue}',
  'content/**/*.md',
],
  theme: {
    container: {
      center: true,
      padding: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.6rem',
        lg: '2rem'
      }
    },
    extend: {
      colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'primary': 'rgb(var(--color-primary) / 1)',
      'secondary': 'rgb(var(--color-secondary) / 1)',
      'accent': 'rgb(var(--color-accent) / 1)',
      'dark': 'rgb(var(--color-dark) / 1)',
      'light': 'rgb(var(--color-light) / 1)',
      'backdrop-start': 'rgb(var(--color-backdrop) / 0.75)',
      'backdrop-end': 'rgb(var(--color-backdrop) / 0.25)',
      },
    },


    screens: {
      'xs': '320px', //min-width
      'sm': '480px',
      'md': '768px',
      'lg': '976px',
      'xl': '1440px',
      '2xl':'1600px',
      '3xl':'1920px',
    },
    fontFamily: {
      'play': ['Play-Bold','sans-serif'],
      'mulish': ['Mulish-Semibold','sans-serif'],
      'inter-regular': ['Inter-Regular','sans-serif'],
      'inter-medium': ['Inter-Medium','sans-serif'],
      'inter-bold': ['Inter-Bold','sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};