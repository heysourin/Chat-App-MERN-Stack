/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1476ff",
        seccondary: "#f3f5ff",
        light: "#f9faff",
        boxShadow: {
          "3xl": "10px 35px 60px -15px rgba(0, 0, 0, 0.9)",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
