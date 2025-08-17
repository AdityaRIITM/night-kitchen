/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b0b16",
        neon: "#9b5cff",
      },
      boxShadow: {
        glow: "0 0 20px rgba(155,92,255,0.5)",
      }
    },
  },
  darkMode: "class",
  plugins: [],
};
