'use client'

import { useMemo } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useComplexPlane } from './ComplexPlane'
import type { Complex } from '@/types/math.types'

interface AnimatedArrowProps {
  from: Complex
  to: Complex
  color?: string
  strokeWidth?: number
  headSize?: number
  progress?: MotionValue<number>
  progressRange?: [number, number]
  label?: string
  labelOffset?: { x: number; y: number }
  glow?: boolean
  opacity?: number | MotionValue<number>
}

/**
 * Renders an animated vector arrow in the complex plane.
 * Must be inside a <ComplexPlane> component.
 */
export function AnimatedArrow({
  from,
  to,
  color = '#6366f1',
  strokeWidth = 2,
  headSize = 8,
  progress,
  progressRange = [0, 1],
  label,
  labelOffset = { x: 12, y: -8 },
  glow = true,
  opacity = 1,
}: AnimatedArrowProps) {
  const { toSVG } = useComplexPlane()

  const svgFrom = useMemo(() => toSVG(from), [from, toSVG])
  const svgTo = useMemo(() => toSVG(to), [to, toSVG])

  // Always call hooks unconditionally
  const fullProgress = useMotionValue(1)
  const activeProgress = progress ?? fullProgress
  const drawProgress = useTransform(activeProgress, progressRange, [0, 1])
  const headVisible = useTransform(drawProgress, [0.8, 1], [0, 1])
  const labelVisible = useTransform(drawProgress, [0.7, 1], [0, 1])

  const dx = svgTo.x - svgFrom.x
  const dy = svgTo.y - svgFrom.y
  const length = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / length
  const uy = dy / length

  const tipOffset = headSize * 0.6
  const lineTo = {
    x: svgTo.x - ux * tipOffset,
    y: svgTo.y - uy * tipOffset,
  }

  return (
    <g>
      {/* Glow shadow */}
      {glow && (
        <motion.line
          x1={svgFrom.x} y1={svgFrom.y}
          x2={lineTo.x} y2={lineTo.y}
          stroke={color}
          strokeWidth={strokeWidth * 4}
          strokeOpacity={0.1}
          strokeLinecap="round"
          style={{ pathLength: drawProgress, opacity, filter: 'blur(6px)' }}
        />
      )}

      {/* Arrow shaft */}
      <motion.line
        x1={svgFrom.x} y1={svgFrom.y}
        x2={lineTo.x} y2={lineTo.y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ pathLength: drawProgress, opacity }}
      />

      {/* Arrowhead */}
      <motion.g style={{ opacity: headVisible }}>
        <Arrowhead tip={svgTo} ux={ux} uy={uy} size={headSize} color={color} />
      </motion.g>

      {/* Label */}
      {label && (
        <motion.text
          x={svgTo.x + labelOffset.x}
          y={svgTo.y + labelOffset.y}
          fill={color}
          fontSize={13}
          fontFamily="var(--font-display), Georgia, serif"
          fontStyle="italic"
          style={{ opacity: labelVisible }}
        >
          {label}
        </motion.text>
      )}

      {/* Origin dot */}
      <circle cx={svgFrom.x} cy={svgFrom.y} r={2} fill={color} opacity={0.5} />
    </g>
  )
}

function Arrowhead({
  tip, ux, uy, size, color,
}: { tip: { x: number; y: number }; ux: number; uy: number; size: number; color: string }) {
  const px = -uy * size * 0.45
  const py = ux * size * 0.45
  const base = { x: tip.x - ux * size, y: tip.y - uy * size }
  return (
    <polygon
      points={`${tip.x},${tip.y} ${base.x + px},${base.y + py} ${base.x - px},${base.y - py}`}
      fill={color}
    />
  )
}

// ─── ComplexPoint ──────────────────────────────────────────────

interface ComplexPointProps {
  z: Complex
  color?: string
  radius?: number
  label?: string
  labelOffset?: { x: number; y: number }
  progress?: MotionValue<number>
  progressRange?: [number, number]
}

export function ComplexPoint({
  z,
  color = '#22d3ee',
  radius = 4,
  label,
  labelOffset = { x: 10, y: -10 },
  progress,
  progressRange = [0, 0.3],
}: ComplexPointProps) {
  const { toSVG } = useComplexPlane()
  const p = useMemo(() => toSVG(z), [z, toSVG])

  const fullProgress = useMotionValue(1)
  const activeProgress = progress ?? fullProgress
  const pointOpacity = useTransform(activeProgress, progressRange, [0, 1])

  return (
    <motion.g style={{ opacity: pointOpacity }}>
      <circle cx={p.x} cy={p.y} r={radius * 2.5} fill={color} opacity={0.12} />
      <circle cx={p.x} cy={p.y} r={radius} fill={color} />
      {label && (
        <text
          x={p.x + labelOffset.x}
          y={p.y + labelOffset.y}
          fill={color}
          fontSize={13}
          fontFamily="var(--font-display), Georgia, serif"
          fontStyle="italic"
        >
          {label}
        </text>
      )}
    </motion.g>
  )
}
