import type { Complex, ComplexFn, DomainConfig, SVGPoint } from '@/types/math.types'

// ─── Construction ──────────────────────────────────────────────

export const complex = (re: number, im = 0): Complex => ({ re, im })

export const fromPolar = (r: number, theta: number): Complex => ({
  re: r * Math.cos(theta),
  im: r * Math.sin(theta),
})

// ─── Arithmetic ────────────────────────────────────────────────

export const add = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
})

export const sub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
})

export const mul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
})

export const div = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}

export const scale = (z: Complex, s: number): Complex => ({ re: z.re * s, im: z.im * s })

export const neg = (z: Complex): Complex => ({ re: -z.re, im: -z.im })

// ─── Properties ───────────────────────────────────────────────

export const modulus = (z: Complex): number => Math.sqrt(z.re * z.re + z.im * z.im)

export const argument = (z: Complex): number => Math.atan2(z.im, z.re)

export const conjugate = (z: Complex): Complex => ({ re: z.re, im: -z.im })

// ─── Elementary functions ──────────────────────────────────────

export const exp = (z: Complex): Complex => ({
  re: Math.exp(z.re) * Math.cos(z.im),
  im: Math.exp(z.re) * Math.sin(z.im),
})

export const log = (z: Complex): Complex => ({
  re: Math.log(modulus(z)),
  im: argument(z),
})

export const pow = (z: Complex, n: number): Complex =>
  fromPolar(Math.pow(modulus(z), n), argument(z) * n)

export const sin = (z: Complex): Complex => ({
  re: Math.sin(z.re) * Math.cosh(z.im),
  im: Math.cos(z.re) * Math.sinh(z.im),
})

export const cos = (z: Complex): Complex => ({
  re: Math.cos(z.re) * Math.cosh(z.im),
  im: -Math.sin(z.re) * Math.sinh(z.im),
})

// ─── Contour factories ─────────────────────────────────────────

/** Circle centered at `center` with given radius, traversed CCW */
export const circleContour = (
  center: Complex,
  radius: number,
  startAngle = 0,
  endAngle = 2 * Math.PI
): ComplexFn => (t: number) => {
  const angle = startAngle + (endAngle - startAngle) * t
  return add(center, fromPolar(radius, angle))
}

/** Straight line segment from z0 to z1 */
export const lineContour = (z0: Complex, z1: Complex): ComplexFn => (t: number) => ({
  re: z0.re + (z1.re - z0.re) * t,
  im: z0.im + (z1.im - z0.im) * t,
})

/** Rectangular contour (traversed CCW): corners at z0 and z1 */
export const rectangleContour = (z0: Complex, z1: Complex): ComplexFn => {
  const corners = [
    z0,
    complex(z1.re, z0.im),
    z1,
    complex(z0.re, z1.im),
    z0,
  ]
  return (t: number) => {
    const segCount = corners.length - 1
    const segIdx = Math.min(Math.floor(t * segCount), segCount - 1)
    const segT = t * segCount - segIdx
    return lineContour(corners[segIdx], corners[segIdx + 1])(segT)
  }
}

/** Keyframe contour: smoothly interpolated through an array of complex points */
export const polylineContour = (points: Complex[]): ComplexFn => (t: number) => {
  if (points.length === 0) return complex(0)
  if (points.length === 1) return points[0]
  const segCount = points.length - 1
  const segIdx = Math.min(Math.floor(t * segCount), segCount - 1)
  const segT = t * segCount - segIdx
  return lineContour(points[segIdx], points[segIdx + 1])(segT)
}

// ─── SVG coordinate mapping ────────────────────────────────────

export function complexToSVG(
  z: Complex,
  domain: DomainConfig,
  svgSize: { width: number; height: number }
): SVGPoint {
  return {
    x: ((z.re - domain.xMin) / (domain.xMax - domain.xMin)) * svgSize.width,
    y: svgSize.height - ((z.im - domain.yMin) / (domain.yMax - domain.yMin)) * svgSize.height,
  }
}

export function svgToComplex(
  p: SVGPoint,
  domain: DomainConfig,
  svgSize: { width: number; height: number }
): Complex {
  return {
    re: domain.xMin + (p.x / svgSize.width) * (domain.xMax - domain.xMin),
    im: domain.yMin + ((svgSize.height - p.y) / svgSize.height) * (domain.yMax - domain.yMin),
  }
}

/**
 * Samples a parametric contour into an SVG path string.
 * @param fn       Parametric function t ∈ [0,1] → Complex
 * @param resolution  Number of line segments
 */
export function sampleContourPath(
  fn: ComplexFn,
  domain: DomainConfig,
  svgSize: { width: number; height: number },
  resolution = 256
): string {
  const commands: string[] = []
  for (let i = 0; i <= resolution; i++) {
    const t = i / resolution
    const z = fn(t)
    const { x, y } = complexToSVG(z, domain, svgSize)
    commands.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(3)} ${y.toFixed(3)}`)
  }
  return commands.join(' ')
}

/**
 * Magnitude-based color for domain coloring (HSL).
 * Maps |f(z)| to lightness, arg(f(z)) to hue.
 */
export function domainColor(z: Complex): string {
  const h = ((argument(z) / (2 * Math.PI)) * 360 + 360) % 360
  const m = modulus(z)
  const l = 0.5 + 0.4 * Math.atan(Math.log(m + 1e-9)) / (Math.PI / 2)
  return `hsl(${h.toFixed(1)}, 70%, ${(l * 100).toFixed(1)}%)`
}
