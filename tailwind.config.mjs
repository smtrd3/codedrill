/** @type {import('tailwindcss').Config} */

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        code: "Source Code Pro",
        sans: "Inter",
      },
    },
  },
};
