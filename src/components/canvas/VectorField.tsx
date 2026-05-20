'use client'

import { useMemo } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useComplexPlane } from './ComplexPlane'
import { modulus, argument } from '@/lib/complexMath'
import type { Complex, ComplexTransform } from '@/types/math.types'

interface VectorFieldProps {
  fn: ComplexTransform
  gridDensity?: number
  maxLength?: number
  colorMode?: 'magnitude' | 'argument' | 'uniform'
  color?: string
  opacity?: number
  progress?: MotionValue<number>
  progressRange?: [number, number]
}

/**
 * Renders a vector field in the complex plane.
 * Must be inside a <ComplexPlane> component.
 */
export function VectorField({
  fn,
  gridDensity = 12,
  maxLength = 22,
  colorMode = 'argument',
  color = '#6366f1',
  opacity = 0.55,
  progress,
  progressRange = [0, 1],
}: VectorFieldProps) {
  const { domain, toSVG } = useComplexPlane()

  // Always call hooks unconditionally
  const fullProgress = useMotionValue(1)
  const activeProgress = progress ?? fullProgress
  const fieldOpacity = useTransform(activeProgress, progressRange, [0, opacity])

  const arrows = useMemo(() => {
    const result: Array<{
      from: { x: number; y: number }
      dx: number
      dy: number
      mag: number
      arg: number
      key: string
    }> = []

    const xStep = (domain.xMax - domain.xMin) / gridDensity
    const yStep = (domain.yMax - domain.yMin) / gridDensity

    let maxMag = 0
    const samples: Array<{ z: Complex; fz: Complex }> = []

    for (let i = 0; i <= gridDensity; i++) {
      for (let j = 0; j <= gridDensity; j++) {
        const re = domain.xMin + i * xStep
        const im = domain.yMin + j * yStep
        const z: Complex = { re, im }
        try {
          const fz = fn(z)
          const mag = modulus(fz)
          if (isFinite(mag) && !isNaN(mag)) {
            maxMag = Math.max(maxMag, mag)
            samples.push({ z, fz })
          }
        } catch { /* skip singularities */ }
      }
    }

    if (maxMag === 0) return result

    for (const { z, fz } of samples) {
      const from = toSVG(z)
      const mag = modulus(fz)
      const arg = argument(fz)
      const scaledMag = (mag / maxMag) * maxLength
      const ux = fz.re / (mag || 1)
      const uy = fz.im / (mag || 1)

      result.push({
        from,
        dx: ux * scaledMag,
        dy: -uy * scaledMag, // SVG y-flip
        mag: mag / maxMag,
        arg,
        key: `${z.re.toFixed(2)},${z.im.toFixed(2)}`,
      })
    }

    return result
  }, [fn, domain, gridDensity, maxLength, toSVG])

  return (
    <motion.g style={{ opacity: fieldOpacity }}>
      {arrows.map(({ from, dx, dy, mag, arg, key }) => {
        const arrowColor = getArrowColor(colorMode, mag, arg, color)
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const ux = dx / len
        const uy = dy / len
        const headSize = 3 + mag * 3
        const tip = { x: from.x + dx, y: from.y + dy }
        const base = { x: tip.x - ux * headSize, y: tip.y - uy * headSize }
        const px = -uy * headSize * 0.5
        const py = ux * headSize * 0.5

        return (
          <g key={key}>
            <line
              x1={from.x} y1={from.y}
              x2={tip.x - ux * headSize * 0.4}
              y2={tip.y - uy * headSize * 0.4}
              stroke={arrowColor}
              strokeWidth={1 + mag * 0.8}
              strokeLinecap="round"
              opacity={0.6 + mag * 0.4}
            />
            <polygon
              points={`${tip.x},${tip.y} ${base.x + px},${base.y + py} ${base.x - px},${base.y - py}`}
              fill={arrowColor}
              opacity={0.7 + mag * 0.3}
            />
          </g>
        )
      })}
    </motion.g>
  )
}

function getArrowColor(mode: VectorFieldProps['colorMode'], mag: number, arg: number, baseColor: string): string {
  switch (mode) {
    case 'argument': {
      const hue = ((arg / (2 * Math.PI)) * 360 + 360) % 360
      return `hsl(${hue.toFixed(0)}, 70%, ${45 + mag * 25}%)`
    }
    case 'magnitude': {
      const hue = Math.max(40, 240 - mag * 200)
      return `hsl(${hue.toFixed(0)}, 80%, 55%)`
    }
    default:
      return baseColor
  }
}
