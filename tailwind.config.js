/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", //need this for dark mode

  // "purging" needed this or tailwind css wouldn't work 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

