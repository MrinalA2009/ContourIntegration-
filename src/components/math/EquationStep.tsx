'use client'

import { useRef } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { KaTeXRenderer } from './KaTeXRenderer'
import { cn } from '@/lib/cn'
import type { EquationStep as EquationStepData } from '@/types/math.types'

interface EquationStepsProps {
  steps: EquationStepData[]
  /**
   * Scroll progress (0→1) from a PinnedScene.
   * Each step occupies an equal slice of the progress range.
   */
  progress: MotionValue<number>
  className?: string
  /** Font size for the equations */
  fontSize?: string
  /** Show connecting "⟹" arrows between steps */
  showArrows?: boolean
}

/**
 * Reveals a sequence of equation steps as the user scrolls through a
 * PinnedScene. Each step fades in sequentially, timed to the progress value.
 *
 * Usage inside a PinnedScene:
 *   <PinnedScene duration={4}>
 *     {(progress) => (
 *       <EquationSteps
 *         progress={progress}
 *         steps={[
 *           { latex: '\\oint_\\gamma f(z)\\,dz' },
 *           { latex: '= 2\\pi i \\sum \\text{Res}(f, z_k)' },
 *         ]}
 *       />
 *     )}
 *   </PinnedScene>
 */
export function EquationSteps({
  steps,
  progress,
  className,
  fontSize = 'clamp(1rem, 2.5vw, 1.4rem)',
  showArrows = false,
}: EquationStepsProps) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {steps.map((step, i) => {
        const segStart = i / steps.length
        const segEnd = (i + 0.7) / steps.length
        return (
          <EquationStepItem
            key={i}
            step={step}
            progress={progress}
            segStart={segStart}
            segEnd={segEnd}
            index={i}
            fontSize={fontSize}
            showArrow={showArrows && i < steps.length - 1}
          />
        )
      })}
    </div>
  )
}

interface EquationStepItemProps {
  step: EquationStepData
  progress: MotionValue<number>
  segStart: number
  segEnd: number
  index: number
  fontSize: string
  showArrow: boolean
}

function EquationStepItem({
  step,
  progress,
  segStart,
  segEnd,
  index,
  fontSize,
  showArrow,
}: EquationStepItemProps) {
  const opacity = useTransform(progress, [segStart, segEnd], [0, 1])
  const y = useTransform(progress, [segStart, segEnd], [20, 0])
  const blur = useTransform(progress, [segStart, segEnd], [8, 0])

  return (
    <motion.div style={{ opacity, y }} className="relative">
      {/* Annotation label */}
      {step.label && (
        <motion.span
          style={{ opacity }}
          className="block font-mono text-[10px] tracking-widest text-content-muted uppercase mb-1.5"
        >
          {step.label}
        </motion.span>
      )}

      {/* Equation */}
      <motion.div
        style={{
          filter: useTransform(blur, (v: number) => `blur(${v}px)`),
          fontSize,
        }}
        className="equation-block"
      >
        <KaTeXRenderer latex={step.latex} display />
      </motion.div>

      {/* Step separator arrow */}
      {showArrow && (
        <motion.div
          style={{ opacity }}
          className="mt-3 text-content-muted font-mono text-sm text-center"
        >
          ⟹
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Single animated step (for use without a sequence) ────────

interface SingleEquationStepProps {
  step: EquationStepData
  progress: MotionValue<number>
  /** Progress range [0,1] when this step is visible */
  range?: [number, number]
  className?: string
  fontSize?: string
}

/**
 * A single equation step controlled by a sub-range of a progress MotionValue.
 */
export function SingleEquationStep({
  step,
  progress,
  range = [0, 0.5],
  className,
  fontSize = 'clamp(1rem, 2.5vw, 1.4rem)',
}: SingleEquationStepProps) {
  const opacity = useTransform(progress, range, [0, 1])
  const y = useTransform(progress, range, [25, 0])

  return (
    <motion.div style={{ opacity, y }} className={cn('relative', className)}>
      {step.label && (
        <span className="block font-mono text-[10px] tracking-widest text-content-muted uppercase mb-1.5">
          {step.label}
        </span>
      )}
      <div className="equation-block" style={{ fontSize }}>
        <KaTeXRenderer latex={step.latex} display />
      </div>
    </motion.div>
  )
}
