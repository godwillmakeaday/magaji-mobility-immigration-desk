import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Institutional Magaji Law mobility palette
        paper: "#FBFAF7",     // off-white background
        ink: "#14213D",       // deep navy text
        charcoal: "#23262B",  // near-black charcoal
        brass: "#B08D57",     // muted brass / gold accent
        "brass-deep": "#8A6D3F",
        forest: "#2F5D4F",    // muted green (verification/compliance)
        "forest-deep": "#234A3E",
        hairline: "#E6E1D6",  // hairline rules
        mist: "#F2EFE8",      // soft section fill
        clay: "#7A2E2A",      // restrained warning red (oxblood-adjacent)
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        sans: ["Libre Franklin", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        content: "1180px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.04), 0 12px 30px -18px rgba(20,33,61,0.18)",
        "card-lift": "0 2px 4px rgba(20,33,61,0.06), 0 22px 48px -22px rgba(20,33,61,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
