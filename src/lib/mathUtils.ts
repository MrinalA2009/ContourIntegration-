/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Clamp a value to [min, max] */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

/** Map a value from one range to another, with optional clamping */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  shouldClamp = true
): number => {
  const t = (value - inMin) / (inMax - inMin)
  const clamped = shouldClamp ? clamp(t, 0, 1) : t
  return lerp(outMin, outMax, clamped)
}

/** Normalise value to 0→1 in range [min, max] */
export const normalise = (value: number, min: number, max: number): number =>
  clamp((value - min) / (max - min), 0, 1)

// ─── Easing functions ──────────────────────────────────────────

export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3)

export const easeIn = (t: number): number => t * t * t

export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

export const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

/** Smooth-step (cubic Hermite, commonly used in shader math) */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Smoother step (quintic, C2 continuous) */
export const smootherstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

// ─── Animation utilities ───────────────────────────────────────

/**
 * Compute the progress within a sub-range, returning 0 outside it.
 * Useful for sequencing animations: each phase occupies a slice of [0,1].
 */
export const progressSlice = (
  progress: number,
  start: number,
  end: number,
  ease: (t: number) => number = easeInOut
): number => {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return ease((progress - start) / (end - start))
}

/** Oscillate between 0 and 1 with a given frequency */
export const oscillate = (t: number, frequency = 1, phase = 0): number =>
  (Math.sin(t * frequency * 2 * Math.PI + phase) + 1) / 2

// ─── Color utilities ───────────────────────────────────────────

/** Interpolate between two hex colors at ratio t ∈ [0,1] */
export function lerpHex(hexA: string, hexB: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '')
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ]
  }
  const [ar, ag, ab] = parse(hexA)
  const [br, bg, bb] = parse(hexB)
  const r = Math.round(lerp(ar, br, t))
  const g = Math.round(lerp(ag, bg, t))
  const b = Math.round(lerp(ab, bb, t))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// ─── Number formatting ─────────────────────────────────────────

export const formatComplex = (re: number, im: number, precision = 2): string => {
  const reStr = re.toFixed(precision)
  const sign = im >= 0 ? '+' : '-'
  const imStr = Math.abs(im).toFixed(precision)
  return `${reStr} ${sign} ${imStr}i`
}
