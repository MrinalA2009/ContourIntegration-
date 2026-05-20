import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#030508',
          surface: '#080c14',
          elevated: '#0d1520',
          overlay: '#111827',
        },
        accent: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#22d3ee',
          rose: '#fb7185',
          gold: '#fbbf24',
          emerald: '#10b981',
        },
        content: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#475569',
          accent: '#818cf8',
        },
        border: {
          subtle: 'rgba(255,255,255,0.04)',
          default: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.12)',
          accent: 'rgba(99,102,241,0.3)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-xl': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(99,102,241,0.2)',
        'glow-md': '0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.1)',
        'glow-lg': '0 0 40px rgba(99,102,241,0.35), 0 0 80px rgba(99,102,241,0.12)',
        'glow-cyan-md': '0 0 20px rgba(34,211,238,0.3), 0 0 40px rgba(34,211,238,0.1)',
        'glow-violet-md': '0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.1)',
        'glow-gold-md': '0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.1)',
        'inner-glow': 'inset 0 0 40px rgba(99,102,241,0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'glow-breathe': 'glow-breathe 4s ease-in-out infinite',
        'draw-path': 'draw-path 2s ease-out forwards',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(8px, -12px)' },
          '66%': { transform: 'translate(-6px, 6px)' },
        },
        'glow-breathe': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(20px)' },
          '50%': { opacity: '1', filter: 'blur(30px)' },
        },
        'draw-path': {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'radial-indigo': 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
        'radial-violet': 'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)',
        'radial-cyan': 'radial-gradient(ellipse at center, rgba(34,211,238,0.12) 0%, transparent 70%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}

export default config
