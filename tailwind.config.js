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
        surface: {
          app: "var(--surface-app)",
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        "app-border": "var(--border-app)",
      },
      fontSize: {
        base: ["14px", "1.5"],
        sm: ["14px", "1.5"],
      },
    },
  },
  plugins: [],
};
