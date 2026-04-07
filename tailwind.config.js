/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '4px 4px 0px 0px #1c1917',
        'soft-sm': '2px 2px 0px 0px #1c1917',
      }
    },
  },
  plugins: [],
}

