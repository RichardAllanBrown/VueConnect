const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: [
      './index.html', 
      './src/**/*.{vue,js,ts,jsx,tsx}',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.coolGray,
      blue: colors.sky,
      green: colors.emerald,
      purple: colors.purple,
      violet: colors.violet,
      red: colors.red,
      amber: colors.amber,
      pink: colors.pink
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
