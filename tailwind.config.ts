import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      colors: {
        surface: {
          DEFAULT: "#06080F",
          elevated: "#0B101B",
          card: "#0F1524"
        },
        brand: {
          violet: "#8B5CF6",
          indigo: "#6366F1",
          cyan: "#22D3EE"
        }
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #22D3EE 100%)",
        "glow-radial":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.22), rgba(34, 211, 238, 0.08), transparent)"
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 60px -12px rgba(0, 0, 0, 0.7)",
        glow: "0 0 40px -10px rgba(139, 92, 246, 0.45), 0 0 24px -8px rgba(34, 211, 238, 0.35)"
      },
      animation: {
        "float-slow": "floatSlow 7s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite"
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" }
        }
      }
    }
  },
  plugins: []
};

export default config;
