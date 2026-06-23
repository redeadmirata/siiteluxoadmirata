import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Cores do Design System ───────────────────────────────────
      colors: {
        ink: 'var(--color-ink)',
        gold: 'var(--color-gold)',
        stone: 'var(--color-stone)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        overlay: 'var(--color-overlay)',
      },

      // ─── Tipografia ───────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Menlo', 'monospace'],
      },

      // ─── Animações ────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        'scroll-x': 'scroll-x 40s linear infinite',
      },

      // ─── Spacing / Sizing ─────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ─── Aspect Ratios ────────────────────────────────────────────
      aspectRatio: {
        'card': '4 / 3',
        'hero': '16 / 9',
        'planta': '4 / 3',
      },

      // ─── Transições ───────────────────────────────────────────────
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },

      // ─── Z-index ──────────────────────────────────────────────────

      // Z-index
      zIndex: {
        'navbar': '100',
        'cta-fixo': '90',
        'modal': '80',
        'overlay': '70',
      },

      maxWidth: {
        'content': '1280px',
      },
    },
  },
  plugins: [],
}

export default config
