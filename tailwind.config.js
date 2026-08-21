/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007A3F",
          hover: "#006633",
          50: "#e6f4ec",
          100: "#c2e4d1",
          200: "#8ecdaa",
          300: "#57b482",
          400: "#2a9d63",
          500: "#007A3F",
          600: "#006e39",
          700: "#005c30",
          800: "#004a27",
          900: "#00351c",
        },
        // Token nền/viền theo Hướng A — tự đổi theo .dark, không cần dark:
        "surface-app": "rgb(var(--surface-app) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "app-border": "rgb(var(--app-border) / <alpha-value>)",
      },
      fontSize: {
        base: ["14px", "1.5"],
        sm: ["14px", "1.5"],
      },
    },
  },
  plugins: [],
};
