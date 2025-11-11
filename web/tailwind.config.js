/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans TC", "sans-serif"],
      },
      colors: {
        "sea-blue": {
          50: "#EBF4F9",
          100: "#BFD9E7",
          200: "#93BED5",
          300: "#77A7C7",
          400: "#5C92BB",
          500: "#3078AF",
          600: "#1F6095",
          700: "#005284",
        },
        "sky-blue": {
          50: "#E3F4F8",
          100: "#BCE9F3",
          200: "#8CD8EC",
          300: "#56C5E3",
          400: "#3EBADD",
          500: "#1BA9D1",
          600: "#0F7D9E",
          700: "#04638A",
        },
        gray: {
          50: "#FAFAFF",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D0D3D9",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
  plugins: [],
};
