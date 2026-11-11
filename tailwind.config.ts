import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Jost", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        zuu: {
          ink: "#0B1220",       // Primary Deep Navy Obsidian
          ink2: "#131C33",      // Secondary Deep Navy
          accent: "#FF4D2E",    // Signature Flame Coral / Sale Red
          accent2: "#FF7A45",   // Secondary Warm Coral Orange
          gold: "#FFB020",      // Warm Amber Gold
          green: "#12B76A",     // Emerald Green (COD / verified)
          soft: "#F6F7FB",      // Soft light gray-blue background
          line: "#E7EAF3",      // Light separator border
          muted: "#5B6478",     // Subtitle text color
          card: "#FFFFFF",
        },
        brand: {
          black: "#0B1220",
          charcoal: "#131C33",
          foreground: "#0B1220",
          white: "#FFFFFF",
          surface: "#F6F7FB",
          warm: "#FFF6F3",
          border: "#E7EAF3",
          muted: "#5B6478",
          sale: "#FF4D2E",
          whatsapp: "#25D366",
          gold: "#FFB020",
          green: "#12B76A",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
