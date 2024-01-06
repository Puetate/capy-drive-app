import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#fef3f2",
          "100": "#fee6e5",
          "200": "#fccfcf",
          "300": "#faa7a8",
          "400": "#f6767a",
          "500": "#ed464f",
          "600": "#d92536",
          "700": "#b7192c",
          "800": "#97172b",
          "900": "#84172c",
          "950": "#490812"
        },
        secondary: {
          "50": "#f7f6f7",
          "100": "#f0eff0",
          "200": "#e3e2e3",
          "300": "#d1cfd2",
          "400": "#bebbbe",
          "500": "#a8a3a8",
          "600": "#989398",
          "700": "#837f83",
          "800": "#6b686b",
          "900": "#595659",
          "950": "#343234"
        }
      }
    }
  },
  darkMode: "class",
  plugins: []
};
export default config;
