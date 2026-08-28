import { PRIMARY } from "./src/utils/colors";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: PRIMARY,
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          app: "rgb(var(--surface-app) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
          3: "rgb(var(--surface-3) / <alpha-value>)",
        },
        "app-border": "rgb(var(--app-border) / <alpha-value>)",
      },
      fontSize: {
        base: ["14px", "1.5"],
        sm: ["14px", "1.5"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
