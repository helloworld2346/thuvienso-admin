/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007A3F",
          hover: "#006633",
        },
      },
      fontSize: {
        base: ["14px", "1.5"],
        sm: ["14px", "1.5"],
      },
    },
  },
  plugins: [],
};
