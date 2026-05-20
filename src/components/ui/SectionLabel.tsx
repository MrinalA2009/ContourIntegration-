'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/cn'

interface SectionLabelProps {
  /** Chapter or section number/code e.g. "01" or "§ 2.3" */
  chapter?: string
  /** Short descriptor e.g. "Complex Numbers" */
  label: string
  className?: string
  /** Accent color. Default: indigo */
  accent?: 'indigo' | 'violet' | 'cyan' | 'gold'
  /** Alignment. Default: left */
  align?: 'left' | 'center' | 'right'
  animate?: boolean
  delay?: number
}

const ACCENT_COLORS: Record<string, string> = {
  indigo: 'rgba(99,102,241,0.8)',
  violet: 'rgba(139,92,246,0.8)',
  cyan: 'rgba(34,211,238,0.8)',
  gold: 'rgba(251,191,36,0.8)',
}

/**
 * A minimal section label — a thin horizontal rule with a chapter tag and title.
 * Used to anchor the beginning of each major scene.
 */
export function SectionLabel({
  chapter,
  label,
  className,
  accent = 'indigo',
  align = 'left',
  animate = true,
  delay = 0,
}: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const color = ACCENT_COLORS[accent]

  const alignClass = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  }[align]

  return (
    <motion.div
      ref={ref}
      initial={animate ? { opacity: 0, x: -20 } : false}
      animate={animate ? (inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }) : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn('flex flex-col gap-2', alignClass, className)}
    >
      <div className="flex items-center gap-3">
        {/* Accent dash */}
        <div
          className="h-[1px] w-8 rounded-full"
          style={{ background: color }}
        />

        {/* Chapter number */}
        {chapter && (
          <span
            className="font-mono text-[10px] tracking-[0.25em] uppercase"
            style={{ color }}
          >
            {chapter}
          </span>
        )}

        {/* Label */}
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-content-muted">
          {label}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Overline label (sits above a headline) ────────────────────

interface OverlineLabelProps {
  children: string
  accent?: 'indigo' | 'violet' | 'cyan' | 'gold'
  className?: string
  animate?: boolean
  delay?: number
}

/**
 * Small overline label that sits above display headings.
 * e.g. "Chapter 3" above a large title.
 */
export function OverlineLabel({
  children,
  accent = 'indigo',
  className,
  animate = true,
  delay = 0,
}: OverlineLabelProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  const color = ACCENT_COLORS[accent]

  return (
    <motion.span
      ref={ref}
      initial={animate ? { opacity: 0 } : false}
      animate={animate ? (inView ? { opacity: 1 } : { opacity: 0 }) : {}}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'inline-flex items-center gap-2',
        'font-mono text-[10px] tracking-[0.3em] uppercase',
        className
      )}
      style={{ color }}
    >
      <span className="inline-block w-3 h-[1px] rounded-full" style={{ background: color }} />
      {children}
    </motion.span>
  )
}
