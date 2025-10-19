
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { brand: { 500:"#f43f5e" } }, boxShadow:{ soft:"0 8px 24px rgba(244,63,94,.15)" } } },
  plugins: [],
};
export default config;
