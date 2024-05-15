/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        "co-lavender": "hsl(234deg, 82%, 85%)",
        "co-mauve": "hsl(267deg, 83%, 80%)",
        "co-base": "hsl(232deg, 23%, 18%)",
        "co-red": "hsl(351deg, 74%, 73%)",
        "co-flamingo": "hsl(0deg, 58%, 86%)",
        "co-green": "hsl(105deg, 48%, 72%)",
        "co-blue": "hsl(220deg, 83%, 75%)",
      }
    },
  },
  plugins: [],
}


