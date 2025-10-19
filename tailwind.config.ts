
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}", "./lib/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  safelist: ["banner","section","card","card-pink","card-inner","btn","btn-primary","btn-ghost","btn-outline","tabbar","tabbar-in","service-card","service-thumb","shadow-soft","page-pad-bottom"],
  plugins: [],
};
export default config;
