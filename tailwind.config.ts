import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      /* =========================================================
         FONTS  →  --font-heading / --font-body / --font-mono
      ========================================================= */
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body:    ["Manrope",        "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
        sans:    ["Manrope",        "sans-serif"],
      },

      /* =========================================================
         COLORS  →  every token in globals.css :root / .dark
      ========================================================= */
      colors: {
        /* ── Surfaces ── */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
        },
        section: {
          DEFAULT: "hsl(var(--section))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar))",
          foreground:           "hsl(var(--foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--border))",
          ring:                 "hsl(var(--primary))",
        },

        /* ── Borders ── */
        border:  "hsl(var(--border))",
        divider: "hsl(var(--divider))",
        input:   "hsl(var(--border))",
        ring:    "hsl(var(--primary))",

        /* ── Text ── */
        "text-secondary": "hsl(var(--text-secondary))",
        "text-muted":     "hsl(var(--text-muted))",

        /* ── Primary ── */
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          hover:      "hsl(var(--primary-hover))",
          glow:       "hsl(var(--primary-glow))",
          foreground: "hsl(var(--primary-foreground))",
        },

        /* ── Secondary ── */
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          glow:       "hsl(var(--secondary-glow))",
          foreground: "hsl(var(--foreground))",
        },

        /* ── shadcn/ui aliases ── */
        muted: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--text-muted))",
        },
        accent: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
        },

        /* ── Status ── */
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--primary-foreground))",
        },
        warning: {
          DEFAULT:    "hsl(var(--warning))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--primary-foreground))",
        },
        info: {
          DEFAULT:    "hsl(var(--info))",
          foreground: "hsl(var(--primary-foreground))",
        },

        /* ── Chart (maps to status tokens) ── */
        chart: {
          1: "hsl(var(--primary))",
          2: "hsl(var(--success))",
          3: "hsl(var(--info))",
          4: "hsl(var(--warning))",
          5: "hsl(var(--destructive))",
        },
      },

      /* =========================================================
         BORDER RADIUS  →  --radius: 1rem
      ========================================================= */
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg:      "var(--radius)",
        md:      "calc(var(--radius) - 2px)",
        sm:      "calc(var(--radius) - 4px)",
        xs:      "calc(var(--radius) - 6px)",
        pill:    "9999px",
      },

      /* =========================================================
         KEYFRAMES  →  mirrors every @keyframes in globals.css
      ========================================================= */
      keyframes: {
        /* Radix accordion */
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },

        /* Entrance */
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)"   },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },

        /* Dropdown */
        dropdownIn: {
          from: { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)"       },
        },

        /* Skeleton shimmer */
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition:  "400px 0" },
        },

        /* Particle drift */
        starDrift: {
          from: { backgroundPosition: "0 0"      },
          to:   { backgroundPosition: "0 -1000px" },
        },
        starDriftReverse: {
          from: { backgroundPosition: "0 0"      },
          to:   { backgroundPosition: "0 1000px"  },
        },
      },

      /* =========================================================
         ANIMATIONS
      ========================================================= */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up   0.2s ease-out",
        "fade-in":        "fadeIn     0.4s ease-out",
        "fade-up":        "fade-up    0.4s cubic-bezier(0.4,0,0.2,1) both",
        "dropdown-in":    "dropdownIn 0.2s ease-out",
        shimmer:          "shimmer    1.4s ease infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};

export default config;