import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./ui/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          500: "#FF5800",
          600: "#E65100"
        }
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #FF5800 0%, #FF8A3D 100%)"
      }
    }
  },
  plugins: []
};

export default config;
