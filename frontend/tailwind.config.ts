import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      }
    },
    extend: {
      fontFamily: {
        roboto: ["Roboto", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        krishna: {
          "grey-dark": "hsl(var(--krishna-grey-dark))",
          grey: "hsl(var(--krishna-grey))",
          "grey-light": "hsl(var(--krishna-grey-light))",
          "grey-bg": "hsl(var(--krishna-grey-bg))",
          gold: "hsl(var(--krishna-gold))",
          "gold-hover": "hsl(var(--krishna-gold-hover))",
          "gold-light": "hsl(var(--krishna-gold-light))",
          "gold-glow": "hsl(var(--krishna-gold-glow))",
          border: "hsl(var(--krishna-border))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "card-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(0.5deg)" },
        },
        "button-pulse": {
          "0%, 100%": { 
            boxShadow: "0 10px 30px hsla(48, 100%, 60%, 0.3), 0 5px 15px hsla(48, 100%, 60%, 0.2)" 
          },
          "50%": { 
            boxShadow: "0 15px 40px hsla(48, 100%, 60%, 0.5), 0 10px 25px hsla(48, 100%, 60%, 0.4)" 
          },
        },
        "button-float": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-8px) scale(1.02)" },
        },
        "shine": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "text-shimmer": {
          "0%": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" },
          "50%": { 
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6)" 
          },
          "100%": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" },
        },
        "cart-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-10px) rotate(2deg)" },
          "75%": { transform: "translateY(-5px) rotate(-2deg)" },
        },
        "cart-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "cart-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 30px hsla(48, 100%, 60%, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 50px hsla(48, 100%, 60%, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.5)" 
          },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.3", filter: "blur(8px)" },
          "50%": { opacity: "0.6", filter: "blur(12px)" },
        },
        "price-appear": {
          from: { opacity: "0", transform: "translateY(-20px) scale(0.8)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "price-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.3)" },
          "60%": { transform: "scale(0.95)" },
        },
        "price-rainbow": {
          "0%": { color: "hsl(48, 100%, 55%)" },
          "25%": { color: "hsl(38, 100%, 55%)" },
          "50%": { color: "hsl(48, 100%, 65%)" },
          "75%": { color: "hsl(38, 100%, 65%)" },
          "100%": { color: "hsl(48, 100%, 55%)" },
        },
        "badge-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "badge-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "badge-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsla(48, 100%, 60%, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 40px hsla(48, 100%, 60%, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.5)" 
          },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.2)" },
        },
        "spinner-orbit": {
          from: { transform: "rotate(0deg) translateX(30px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(30px) rotate(-360deg)" },
        },
        "spinner-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "shimmer-wave": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "image-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-1deg)" },
        },
        "fab-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-15px) rotate(5deg)" },
          "66%": { transform: "translateY(-8px) rotate(-5deg)" },
        },
        "fab-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "counter-roll": {
          from: { 
            transform: "translateY(-30px)",
            opacity: "0",
            filter: "blur(10px)"
          },
          to: { 
            transform: "translateY(0)",
            opacity: "1",
            filter: "blur(0)"
          },
        },
        "marquee-scroll": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 20s ease infinite",
        "card-float": "card-float 6s ease-in-out infinite",
        "button-pulse": "button-pulse 3s ease-in-out infinite",
        "button-float": "button-float 4s ease-in-out infinite",
        "shine": "shine 3s linear infinite",
        "text-shimmer": "text-shimmer 2s linear infinite",
        "cart-float": "cart-float 5s ease-in-out infinite",
        "cart-spin": "cart-spin 20s linear infinite",
        "cart-pulse": "cart-pulse 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "price-appear": "price-appear 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "price-bounce": "price-bounce 1s ease-in-out",
        "price-rainbow": "price-rainbow 4s linear infinite",
        "badge-spin": "badge-spin 15s linear infinite",
        "badge-bounce": "badge-bounce 2s ease-in-out infinite",
        "badge-glow": "badge-glow 3s ease-in-out infinite",
        "star-twinkle": "star-twinkle 3s ease-in-out infinite",
        "spinner-orbit": "spinner-orbit 3s linear infinite",
        "spinner-rotate": "spinner-rotate 2s linear infinite",
        "shimmer-wave": "shimmer-wave 2s ease-in-out infinite",
        "image-float": "image-float 8s ease-in-out infinite",
        "fab-float": "fab-float 4s ease-in-out infinite",
        "fab-spin": "fab-spin 30s linear infinite",
        "counter-roll": "counter-roll 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "marquee-scroll": "marquee-scroll 20s linear infinite",
      },
      boxShadow: {
        card: "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 10px 25px -10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        "card-hover": "0 30px 60px -20px rgba(0, 0, 0, 0.12), 0 20px 40px -15px rgba(0, 0, 0, 0.10), 0 0 50px hsla(48, 100%, 60%, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)",
        glow: "0 0 40px hsla(48, 100%, 60%, 0.4), 0 20px 50px -15px rgba(0, 0, 0, 0.15)",
        float: "0 50px 100px -20px hsla(48, 100%, 60%, 0.3), 0 30px 60px -30px rgba(0, 0, 0, 0.2)",
        dropdown: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 30px hsla(48, 100%, 60%, 0.2)",
      },
      backgroundImage: {
        "gradient-sunrise": "linear-gradient(135deg, hsl(48, 100%, 65%) 0%, hsl(48, 100%, 55%) 25%, hsl(38, 100%, 55%) 50%, hsl(48, 100%, 55%) 75%, hsl(48, 100%, 65%) 100%)",
        "gradient-grey-sunset": "linear-gradient(135deg, hsl(220, 15%, 95%) 0%, hsl(220, 15%, 85%) 25%, hsl(220, 15%, 75%) 50%, hsl(220, 15%, 85%) 75%, hsl(220, 15%, 95%) 100%)",
        "gradient-button": "linear-gradient(125deg, hsl(48, 100%, 60%) 0%, hsl(48, 100%, 55%) 50%, hsl(38, 100%, 55%) 100%)",
        "gradient-button-hover": "linear-gradient(125deg, hsl(48, 100%, 65%) 0%, hsl(48, 100%, 60%) 50%, hsl(38, 100%, 60%) 100%)",
        "gradient-card": "linear-gradient(145deg, hsl(0, 0%, 100%) 0%, hsl(210, 20%, 98%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;