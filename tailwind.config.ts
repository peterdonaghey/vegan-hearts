import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Official VeganHearts brand colors (from logo)
        'vh-orange': '#ed8329',
        'vh-green': '#39713b',
        'vh-green-dark': '#2d5a30',
        // Legacy colors (deprecated)
        'earth-brown': '#8B7355',
        'forest-green': '#2D5016',
        'leaf-green': '#7CB342',
        'warm-cream': '#F5F1E8',
        'sunset-orange': '#FF7043',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-quicksand)', 'system-ui', 'sans-serif'],
        lora: ['var(--font-lora)', 'Georgia', 'serif'],
        typewriter: ['var(--font-special-elite)', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;

