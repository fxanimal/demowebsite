import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom clinic brand colors here
        clinic: {
          primary: "#2563eb", // Blue-600
          secondary: "#4f46e5", // Indigo-600
        }
      },
    },
  },
  plugins: [],
};
export default config;