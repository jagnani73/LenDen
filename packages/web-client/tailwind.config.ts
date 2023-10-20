import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        dots: 'url("/bg/dots.svg")',
      },
      colors: {
        "french-grey": "#AEAEB2",
        "green-yellow": "#9CFF1F",
        "ghost-white": "#F2F2F7",
      },
    },
  },
  plugins: [],
};
export default config;
