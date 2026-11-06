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
        sans: ["var(--font-jost)", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#000000",
          charcoal: "#111111",
          foreground: "#1A1A1A",
          white: "#FFFFFF",
          surface: "#FDFDFD",
          warm: "#EFE7DD",
          border: "#EEEEEE",
          muted: "#6B6B6B",
          sale: "#E84E4E",
          whatsapp: "#25D366",
          gold: "#FFD700",
        },
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

