import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1440px",
      },
    },

    extend: {
      /* ================= FONTS ================= */
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
        roboto: ["Roboto", "system-ui", "sans-serif"],
      },

      /* ================= COLORS ================= */
      colors: {
        krishna: {
          /* Greys */
          "grey-dark": "#121212",
          "grey": "#1f1f1f",
          "grey-light": "#2a2a2a",
          "grey-bg": "#f6f6f6",

          /* Gold / Yellow */
          gold: "#facc15",
          "gold-hover": "#eab308",
          "gold-light": "#fef3c7",

          /* Borders */
          border: "#e5e7eb",
        },
      },

      /* ================= RADIUS ================= */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },

      /* ================= SHADOWS ================= */
      boxShadow: {
        card:
          "0 10px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        "card-hover":
          "0 20px 50px rgba(0,0,0,0.12), 0 10px 25px rgba(0,0,0,0.08)",
        dropdown:
          "0 25px 50px rgba(0,0,0,0.15)",
        glow:
          "0 0 40px rgba(250,204,21,0.35)",
      },

      /* ================= BACKGROUNDS ================= */
      backgroundImage: {
        "gradient-grey":
          "linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
      },

      /* ================= ANIMATIONS ================= */
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        floatSoft: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },

      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "float-soft": "floatSoft 6s ease-in-out infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
} satisfies Config;
