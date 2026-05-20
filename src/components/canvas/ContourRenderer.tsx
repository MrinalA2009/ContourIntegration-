'use client'

import { useMemo } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { sampleContourPath } from '@/lib/complexMath'
import { useComplexPlane } from './ComplexPlane'
import type { ContourPath, Complex, SVGPoint } from '@/types/math.types'

interface ContourRendererProps {
  path: ContourPath
  /**
   * Scroll progress (0→1) controlling how much of the contour is drawn.
   * When omitted, the full path is drawn immediately.
   */
  progress?: MotionValue<number>
  progressRange?: [number, number]
  color?: string
  strokeWidth?: number
  showArrow?: boolean
  glowIntensity?: number
  dashArray?: string
  label?: string
  opacity?: number | MotionValue<number>
}

/**
 * Animates a parametric contour path being drawn in the complex plane.
 * Must be rendered inside a <ComplexPlane> component.
 */
export function ContourRenderer({
  path,
  progress,
  progressRange = [0, 1],
  color = '#6366f1',
  strokeWidth = 2.5,
  showArrow = true,
  glowIntensity = 0.6,
  dashArray,
  label,
  opacity = 1,
}: ContourRendererProps) {
  const { domain, svgWidth, svgHeight, toSVG } = useComplexPlane()

  const svgPath = useMemo(
    () =>
      sampleContourPath(
        path.fn,
        domain,
        { width: svgWidth, height: svgHeight },
        path.resolution ?? 256
      ),
    [path.fn, path.resolution, domain, svgWidth, svgHeight]
  )

  // Always call hooks unconditionally
  const fullProgress = useMotionValue(1)
  const activeProgress = progress ?? fullProgress
  const drawLength = useTransform(activeProgress, progressRange, [0, 1])
  const headOpacity = useTransform(drawLength, [0.85, 1], [0, 1])

  const labelPoint = useMemo(() => toSVG(path.fn(1)), [path, toSVG])

  return (
    <g>
      {/* Glow layer */}
      <motion.path
        d={svgPath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 3}
        strokeOpacity={0.12}
        filter="url(#contour-blur)"
        style={{ pathLength: drawLength, opacity }}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main path */}
      <motion.path
        d={svgPath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: drawLength, opacity }}
      />

      {/* Blur filter definition */}
      <defs>
        <filter id="contour-blur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Arrow head at end */}
      {showArrow && (
        <motion.g style={{ opacity: headOpacity }}>
          <ContourArrowHead path={path} color={color} size={strokeWidth * 3.5} toSVG={toSVG} />
        </motion.g>
      )}

      {/* Label */}
      {label && (
        <motion.text
          x={labelPoint.x + 12}
          y={labelPoint.y - 8}
          fill={color}
          fontSize={14}
          fontFamily="var(--font-display), Georgia, serif"
          fontStyle="italic"
          style={{ opacity: headOpacity }}
        >
          {label}
        </motion.text>
      )}
    </g>
  )
}

// ─── Arrowhead ─────────────────────────────────────────────────

function ContourArrowHead({
  path,
  color,
  size,
  toSVG,
}: {
  path: ContourPath
  color: string
  size: number
  toSVG: (z: Complex) => SVGPoint
}) {
  const epsilon = 0.002
  const end = toSVG(path.fn(1))
  const near = toSVG(path.fn(1 - epsilon))

  const dx = end.x - near.x
  const dy = end.y - near.y
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / len
  const uy = dy / len
  const px = -uy * size * 0.5
  const py = ux * size * 0.5

  const tip = { x: end.x + ux * size * 0.25, y: end.y + uy * size * 0.25 }
  const left = { x: end.x - ux * size + px, y: end.y - uy * size + py }
  const right = { x: end.x - ux * size - px, y: end.y - uy * size - py }

  return (
    <polygon
      points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`}
      fill={color}
    />
  )
}
