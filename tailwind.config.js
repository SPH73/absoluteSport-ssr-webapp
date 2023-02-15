/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "components/**/*.{vue,js,ts}",
    "layouts/**/*.vue",
    "pages/**/*.vue",
    "composables/**/*.{js,ts}",
    "plugins/**/*.{js,ts}",
    "App.{js,ts,vue}",
    "app.{js,ts,vue}",
    "Error.{js,ts,vue}",
    "error.{js,ts,vue}",
    "content/**/*.md",
  ],
  theme: {
    fontFamily: {
      play: ["Play-Bold", "sans-serif"],
      mulish: ["Mulish-Semibold", "sans-serif"],
      "inter-regular": ["Inter-Regular", "sans-serif"],
      "inter-medium": ["Inter-Medium", "sans-serif"],
      "inter-bold": ["Inter-Bold", "sans-serif"],
    },
    screens: {
      xs: "375px", //min-width
      sm: "390px",
      md: "768px",
      lg: "1280px",
      xl: "1366px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
        "3xl": "8rem",
      },
    },

    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "rgb(var(--color-primary) / 1)",
        secondary: "rgb(var(--color-secondary) / 1)",
        accent: "rgb(var(--color-accent) / 1)",
        dark: "rgb(var(--color-dark) / 1)",
        light: "rgb(var(--color-light) / 1)",
      },
      keyframes: {
        modal: {
          "0%": {
            transform: "-translate-y-[50px]",
            scale: "scale-90",
            opacity: "opacity-0",
          },
          "100%": {
            transform: "translate-y-0",
            scale: "scale-100",
            opacity: "opacity-100",
          },
        },
      },
      animation: {
        modal: "modal 0.3s ease-in-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
