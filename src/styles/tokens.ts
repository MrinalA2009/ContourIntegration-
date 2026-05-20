export const colors = {
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
  glow: {
    indigo: 'rgba(99, 102, 241, 0.25)',
    violet: 'rgba(139, 92, 246, 0.25)',
    cyan: 'rgba(34, 211, 238, 0.25)',
    rose: 'rgba(251, 113, 133, 0.25)',
    gold: 'rgba(251, 191, 36, 0.25)',
  },
  text: {
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
    cyan: 'rgba(34,211,238,0.3)',
  },
} as const

export const fonts = {
  display: 'var(--font-display), Georgia, serif',
  ui: 'var(--font-ui), system-ui, sans-serif',
  mono: 'var(--font-mono), monospace',
} as const

export const glow = {
  text: {
    indigo: '0 0 20px rgba(99,102,241,0.6), 0 0 40px rgba(99,102,241,0.3)',
    violet: '0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.3)',
    cyan: '0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.3)',
    white: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.15)',
    gold: '0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(251,191,36,0.3)',
  },
  box: {
    sm: '0 0 10px rgba(99,102,241,0.2)',
    md: '0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.1)',
    lg: '0 0 40px rgba(99,102,241,0.35), 0 0 80px rgba(99,102,241,0.12)',
    cyan: '0 0 20px rgba(34,211,238,0.3), 0 0 40px rgba(34,211,238,0.1)',
    violet: '0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.1)',
  },
} as const

export const spacing = {
  scene: {
    paddingX: 'clamp(1.5rem, 5vw, 6rem)',
    paddingY: 'clamp(2rem, 5vh, 5rem)',
  },
} as const

export const transitions = {
  cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smoothOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export type AccentColor = keyof typeof colors.accent
export type GlowColor = keyof typeof glow.text
