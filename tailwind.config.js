
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
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'primary': 'rgb(var(--color-primary) / <alpha-value>)',
      'secondary': 'rgb(var(--color-secondary) / <alpha-value>)',
      'accent': 'rgb(var(--color-accent) / <alpha-value>)',
      'dark': 'rgb(var(--color-dark) / <alpha-value>)',
      'light': 'rgb(var(--color-light) / <alpha-value>)',
      'backdrop': 'rgb(var(--color-backdrop) / <alpha-value>)',
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