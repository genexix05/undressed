/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/preline/preline.js"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Akira", "sans-serif"],
      },
      spacing: {
        "9/16": "56.25%",
      },
    },
  },
  plugins: [require("preline/plugin")],
};
