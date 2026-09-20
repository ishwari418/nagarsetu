import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0E1B2A", soft: "#1B2E44", muted: "#5B6B7F" },
        civic: { DEFAULT: "#0F5E5C", dark: "#0A4443", light: "#E3F0EF" },
        clay: { DEFAULT: "#B3541E", light: "#FBECE1" },
        paper: "#F4F6F5",
        line: "#DDE3E2",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "Inter", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: { card: "0 1px 2px rgba(14,27,42,.06), 0 8px 24px -16px rgba(14,27,42,.25)" },
    },
  },
  plugins: [],
};
export default config;
