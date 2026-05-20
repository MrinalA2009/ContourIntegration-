'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react'
import { cn } from '@/lib/cn'
import { complexToSVG, svgToComplex } from '@/lib/complexMath'
import type { Complex, DomainConfig, ComplexPlaneContextValue, SVGPoint } from '@/types/math.types'

// ─── Context ──────────────────────────────────────────────────

const ComplexPlaneContext = createContext<ComplexPlaneContextValue | null>(null)

export function useComplexPlane(): ComplexPlaneContextValue {
  const ctx = useContext(ComplexPlaneContext)
  if (!ctx) throw new Error('useComplexPlane must be used inside <ComplexPlane>')
  return ctx
}

// ─── Component ────────────────────────────────────────────────

interface ComplexPlaneProps {
  domain?: DomainConfig
  /** SVG viewBox width (logical units). Default 600 */
  viewBoxWidth?: number
  /** SVG viewBox height (logical units). Default 600 */
  viewBoxHeight?: number
  className?: string
  children?: ReactNode
  /** Show real/imaginary axis labels */
  showLabels?: boolean
  /** Grid line color */
  gridColor?: string
  /** Axis color */
  axisColor?: string
}

const DEFAULT_DOMAIN: DomainConfig = { xMin: -3, xMax: 3, yMin: -3, yMax: 3 }

/**
 * SVG-based complex plane canvas.
 *
 * Provides ComplexPlaneContext so children (ContourRenderer, AnimatedArrow, etc.)
 * can convert between complex and SVG coordinates without knowing the domain.
 *
 * Usage:
 *   <ComplexPlane domain={{ xMin: -2, xMax: 2, yMin: -2, yMax: 2 }}>
 *     <CoordinateSystem />
 *     <ContourRenderer path={circleContour(complex(0), 1)} progress={p} />
 *     <AnimatedArrow from={complex(0)} to={complex(1, 1)} />
 *   </ComplexPlane>
 */
export function ComplexPlane({
  domain = DEFAULT_DOMAIN,
  viewBoxWidth = 600,
  viewBoxHeight = 600,
  className,
  children,
  showLabels = true,
  gridColor = 'rgba(255,255,255,0.06)',
  axisColor = 'rgba(255,255,255,0.25)',
}: ComplexPlaneProps) {
  const toSVG = useCallback(
    (z: Complex): SVGPoint =>
      complexToSVG(z, domain, { width: viewBoxWidth, height: viewBoxHeight }),
    [domain, viewBoxWidth, viewBoxHeight]
  )

  const fromSVG = useCallback(
    (p: SVGPoint): Complex =>
      svgToComplex(p, domain, { width: viewBoxWidth, height: viewBoxHeight }),
    [domain, viewBoxWidth, viewBoxHeight]
  )

  const svgSize = { width: viewBoxWidth, height: viewBoxHeight }

  const contextValue: ComplexPlaneContextValue = {
    domain,
    svgWidth: viewBoxWidth,
    svgHeight: viewBoxHeight,
    toSVG,
    fromSVG,
  }

  // Axis pixel positions
  const origin = toSVG({ re: 0, im: 0 })

  return (
    <ComplexPlaneContext.Provider value={contextValue}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className={cn('w-full h-full', className)}
        style={{ overflow: 'visible' }}
        aria-label="Complex plane visualization"
      >
        {/* Minor grid */}
        <GridLines
          domain={domain}
          svgSize={svgSize}
          toSVG={toSVG}
          color={gridColor}
          minor
        />

        {/* Major grid */}
        <GridLines
          domain={domain}
          svgSize={svgSize}
          toSVG={toSVG}
          color="rgba(255,255,255,0.1)"
        />

        {/* Axes */}
        <line
          x1={0} y1={origin.y}
          x2={viewBoxWidth} y2={origin.y}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        <line
          x1={origin.x} y1={0}
          x2={origin.x} y2={viewBoxHeight}
          stroke={axisColor}
          strokeWidth={1.5}
        />

        {/* Axis labels */}
        {showLabels && (
          <AxisLabels
            domain={domain}
            svgSize={svgSize}
            toSVG={toSVG}
            axisColor={axisColor}
          />
        )}

        {/* Children: contours, arrows, points, etc. */}
        {children}
      </svg>
    </ComplexPlaneContext.Provider>
  )
}

// ─── Grid ─────────────────────────────────────────────────────

interface GridLinesProps {
  domain: DomainConfig
  svgSize: { width: number; height: number }
  toSVG: (z: Complex) => SVGPoint
  color: string
  minor?: boolean
}

function GridLines({ domain, svgSize, toSVG, color, minor = false }: GridLinesProps) {
  const step = minor ? 0.5 : 1
  const lines: ReactNode[] = []

  // Vertical lines (constant Re)
  for (let x = Math.ceil(domain.xMin / step) * step; x <= domain.xMax; x += step) {
    const p = toSVG({ re: x, im: 0 })
    lines.push(
      <line
        key={`v-${x}`}
        x1={p.x} y1={0}
        x2={p.x} y2={svgSize.height}
        stroke={color}
        strokeWidth={minor ? 0.5 : 1}
      />
    )
  }

  // Horizontal lines (constant Im)
  for (let y = Math.ceil(domain.yMin / step) * step; y <= domain.yMax; y += step) {
    const p = toSVG({ re: 0, im: y })
    lines.push(
      <line
        key={`h-${y}`}
        x1={0} y1={p.y}
        x2={svgSize.width} y2={p.y}
        stroke={color}
        strokeWidth={minor ? 0.5 : 1}
      />
    )
  }

  return <g>{lines}</g>
}

// ─── Labels ───────────────────────────────────────────────────

interface AxisLabelsProps {
  domain: DomainConfig
  svgSize: { width: number; height: number }
  toSVG: (z: Complex) => SVGPoint
  axisColor: string
}

function AxisLabels({ domain, svgSize, toSVG, axisColor }: AxisLabelsProps) {
  const origin = toSVG({ re: 0, im: 0 })
  const textStyle: React.SVGAttributes<SVGTextElement> = {
    fill: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontFamily: 'var(--font-mono), monospace',
  }

  const ticks: ReactNode[] = []

  // Re axis ticks
  for (let x = Math.ceil(domain.xMin); x <= domain.xMax; x++) {
    if (x === 0) continue
    const p = toSVG({ re: x, im: 0 })
    ticks.push(
      <g key={`re-${x}`}>
        <line x1={p.x} y1={origin.y - 4} x2={p.x} y2={origin.y + 4} stroke={axisColor} strokeWidth={1} />
        <text {...textStyle} x={p.x} y={origin.y + 16} textAnchor="middle">{x}</text>
      </g>
    )
  }

  // Im axis ticks
  for (let y = Math.ceil(domain.yMin); y <= domain.yMax; y++) {
    if (y === 0) continue
    const p = toSVG({ re: 0, im: y })
    ticks.push(
      <g key={`im-${y}`}>
        <line x1={origin.x - 4} y1={p.y} x2={origin.x + 4} y2={p.y} stroke={axisColor} strokeWidth={1} />
        <text {...textStyle} x={origin.x - 8} y={p.y + 4} textAnchor="end">
          {y}i
        </text>
      </g>
    )
  }

  return (
    <g>
      {ticks}
      {/* Axis labels */}
      <text {...textStyle} x={svgSize.width - 12} y={origin.y - 10} textAnchor="end" fill="rgba(255,255,255,0.6)">
        Re
      </text>
      <text {...textStyle} x={origin.x + 10} y={12} textAnchor="start" fill="rgba(255,255,255,0.6)">
        Im
      </text>
    </g>
  )
}
