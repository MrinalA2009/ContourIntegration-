'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { KaTeXRenderer } from './KaTeXRenderer'
import { cn } from '@/lib/cn'

interface AnimatedEquationProps {
  latex: string
  display?: boolean
  className?: string
  progress?: MotionValue<number>
  progressRange?: [number, number]
  delay?: number
  fontSize?: string
  glowClass?: string
  label?: string
  animate?: boolean
}

/**
 * Renders a KaTeX equation with a cinematic entrance animation.
 *
 * Two modes:
 *  1. IntersectionObserver (default): animates when equation enters viewport.
 *  2. Scroll-progress driven: pass `progress` and `progressRange` to tie
 *     the animation to a PinnedScene's progress MotionValue.
 */
export function AnimatedEquation({
  latex,
  display = true,
  className,
  progress,
  progressRange = [0, 0.3],
  delay = 0,
  fontSize,
  glowClass,
  label,
  animate = true,
}: AnimatedEquationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  // Always call hooks unconditionally — use a fallback when no progress is provided
  const fallback = useMotionValue(1)
  const activeProgress = progress ?? fallback
  const progressOpacity = useTransform(activeProgress, progressRange, [0, 1])
  const progressY = useTransform(activeProgress, progressRange, [30, 0])

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      initial={progress || !animate ? false : { opacity: 0, y: 30 }}
      animate={
        progress || !animate
          ? undefined
          : inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 30 }
      }
      style={progress ? { opacity: progressOpacity, y: progressY } : undefined}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: delay / 1000,
      }}
    >
      {label && (
        <span className="block font-mono text-[10px] tracking-widest text-content-muted uppercase mb-2">
          {label}
        </span>
      )}

      <div
        className={cn('equation-block', glowClass)}
        style={fontSize ? { fontSize } : undefined}
      >
        <KaTeXRenderer latex={latex} display={display} />
      </div>
    </motion.div>
  )
}
