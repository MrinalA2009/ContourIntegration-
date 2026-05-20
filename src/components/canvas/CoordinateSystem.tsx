'use client'

import { type ReactNode } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useComplexPlane } from './ComplexPlane'

interface CoordinateSystemProps {
  progress?: MotionValue<number>
  progressRange?: [number, number]
  axisColor?: string
  tickColor?: string
  labelColor?: string
}

/**
 * Enhanced coordinate system overlay for ComplexPlane.
 * Must be inside a <ComplexPlane>.
 */
export function CoordinateSystem({
  progress,
  progressRange = [0, 0.4],
  axisColor = 'rgba(255,255,255,0.3)',
  tickColor = 'rgba(255,255,255,0.2)',
  labelColor = 'rgba(255,255,255,0.5)',
}: CoordinateSystemProps) {
  const { domain, svgWidth, svgHeight, toSVG } = useComplexPlane()
  const origin = toSVG({ re: 0, im: 0 })

  // Always call hooks unconditionally
  const fullProgress = useMotionValue(1)
  const activeProgress = progress ?? fullProgress
  const drawProgress = useTransform(activeProgress, progressRange, [0, 1])

  return (
    <g>
      {/* Re axis */}
      <motion.line
        x1={0} y1={origin.y}
        x2={svgWidth} y2={origin.y}
        stroke={axisColor}
        strokeWidth={1.5}
        style={{ pathLength: drawProgress }}
      />

      {/* Im axis */}
      <motion.line
        x1={origin.x} y1={0}
        x2={origin.x} y2={svgHeight}
        stroke={axisColor}
        strokeWidth={1.5}
        style={{ pathLength: drawProgress }}
      />

      {/* Axis arrowheads */}
      <polygon
        points={`${svgWidth - 7},${origin.y - 5} ${svgWidth},${origin.y} ${svgWidth - 7},${origin.y + 5}`}
        fill={axisColor}
      />
      <polygon
        points={`${origin.x - 5},7 ${origin.x},0 ${origin.x + 5},7`}
        fill={axisColor}
      />

      {/* Axis name labels */}
      <text x={svgWidth - 14} y={origin.y - 12} fill={labelColor} fontSize={12}
        fontFamily="var(--font-display), Georgia, serif" fontStyle="italic" textAnchor="end">
        Re(z)
      </text>
      <text x={origin.x + 12} y={16} fill={labelColor} fontSize={12}
        fontFamily="var(--font-display), Georgia, serif" fontStyle="italic">
        Im(z)
      </text>

      {/* Origin */}
      <text x={origin.x + 6} y={origin.y + 16} fill={labelColor} fontSize={10}
        fontFamily="var(--font-mono), monospace">
        O
      </text>

      <TickMarks domain={domain} toSVG={toSVG} origin={origin} tickColor={tickColor} labelColor={labelColor} />
    </g>
  )
}

interface TickMarksProps {
  domain: { xMin: number; xMax: number; yMin: number; yMax: number }
  toSVG: (z: { re: number; im: number }) => { x: number; y: number }
  origin: { x: number; y: number }
  tickColor: string
  labelColor: string
}

function TickMarks({ domain, toSVG, origin, tickColor, labelColor }: TickMarksProps) {
  const ticks: ReactNode[] = []
  const textProps = { fill: labelColor, fontSize: 10, fontFamily: 'var(--font-mono), monospace' }

  for (let x = Math.ceil(domain.xMin); x <= domain.xMax; x++) {
    if (x === 0) continue
    const p = toSVG({ re: x, im: 0 })
    ticks.push(
      <g key={`re-${x}`}>
        <line x1={p.x} y1={origin.y - 5} x2={p.x} y2={origin.y + 5} stroke={tickColor} strokeWidth={1} />
        <text {...textProps} x={p.x} y={origin.y + 18} textAnchor="middle">{x}</text>
      </g>
    )
  }

  for (let y = Math.ceil(domain.yMin); y <= domain.yMax; y++) {
    if (y === 0) continue
    const p = toSVG({ re: 0, im: y })
    ticks.push(
      <g key={`im-${y}`}>
        <line x1={origin.x - 5} y1={p.y} x2={origin.x + 5} y2={p.y} stroke={tickColor} strokeWidth={1} />
        <text {...textProps} x={origin.x - 8} y={p.y + 4} textAnchor="end">
          {y === 1 ? 'i' : y === -1 ? '−i' : `${y}i`}
        </text>
      </g>
    )
  }

  return <g>{ticks}</g>
}
