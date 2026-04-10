/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      fontFamily: {
        sans: ["Montserrat-Regular", "sans-serif"],
        "sans-semibold": ["Montserrat-SemiBold", "sans-serif"],
        serif: ["Sansita-ExtraBoldItalic", "serif"],
        montserrat: ["Montserrat-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
}

