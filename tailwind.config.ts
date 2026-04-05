import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./ui/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          500: "#0170C1",
          600: "#015A9A"
        },
        signal: {
          500: "#FF5800",
          600: "#D94700"
        }
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #00395F 0%, #0170C1 58%, #2687CF 100%)",
        "signal-gradient": "linear-gradient(135deg, #FF5800 0%, #FF8A4A 100%)"
      }
    }
  },
  plugins: []
};

export default config;
