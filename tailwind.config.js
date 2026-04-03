/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'pastel-bg': '#add3ff',
        'pastel-pink': '#f5d1fd',
        'pastel-blue': '#add3ff',
        'pastel-mint': '#9FE2BF',
        'pastel-yellow': '#fff2b1',
        'ink': '#2D2D2D',
      },
      boxShadow: {
        'soft': '4px 4px 0px 0px #2D2D2d',
        'soft-sm': '2px 2px 0px 0px #2D2D2D',
      }
    },
  },
  plugins: [],
}

