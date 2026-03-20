import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1A1A2E",
        hairline: "#E5E7EB",
        "surface": "#F9F9F9",
        "surface-container": "#EBEEEF",
        "surface-container-low": "#F2F4F4",
        "on-surface": "#2D3435",
        "on-surface-variant": "#5A6061",
      },
      fontFamily: {
        headline: ["Outfit", "Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
