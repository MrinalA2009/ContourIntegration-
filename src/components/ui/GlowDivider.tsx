'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/cn'

interface GlowDividerProps {
  orientation?: 'horizontal' | 'vertical'
  accent?: 'indigo' | 'violet' | 'cyan' | 'gold' | 'white'
  className?: string
  animate?: boolean
  /** Width for horizontal, height for vertical */
  size?: string
  opacity?: number
}

const GRADIENT_PRESETS: Record<string, string> = {
  indigo: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)',
  violet: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.7) 50%, transparent 100%)',
  cyan: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.7) 50%, transparent 100%)',
  gold: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.7) 50%, transparent 100%)',
  white: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
}

const VERTICAL_GRADIENTS: Record<string, string> = {
  indigo: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)',
  violet: 'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.7) 50%, transparent 100%)',
  cyan: 'linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.7) 50%, transparent 100%)',
  gold: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.7) 50%, transparent 100%)',
  white: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
}

/**
 * A glowing divider line — horizontal or vertical.
 * Animates in with a scale-from-center reveal.
 */
export function GlowDivider({
  orientation = 'horizontal',
  accent = 'indigo',
  className,
  animate = true,
  size,
  opacity = 1,
}: GlowDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  const isHorizontal = orientation === 'horizontal'
  const gradient = isHorizontal ? GRADIENT_PRESETS[accent] : VERTICAL_GRADIENTS[accent]

  return (
    <motion.div
      ref={ref}
      initial={animate ? { scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0, opacity: 0 } : false}
      animate={
        animate
          ? inView
            ? { scaleX: 1, scaleY: 1, opacity }
            : { scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0, opacity: 0 }
          : { opacity }
      }
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        isHorizontal ? 'w-full h-[1px]' : 'h-full w-[1px]',
        className
      )}
      style={{
        background: gradient,
        ...(isHorizontal ? { width: size } : { height: size }),
      }}
    />
  )
}

// ─── Section divider with centered icon ───────────────────────

interface SectionDividerProps {
  className?: string
  accent?: 'indigo' | 'violet' | 'cyan'
  icon?: string
}

/**
 * Full-width divider with a centered symbol — good between major sections.
 */
export function SectionDivider({ className, accent = 'indigo', icon = '∮' }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const color = {
    indigo: 'rgba(99,102,241,0.6)',
    violet: 'rgba(139,92,246,0.6)',
    cyan: 'rgba(34,211,238,0.6)',
  }[accent]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={cn('flex items-center gap-4 w-full', className)}
    >
      <GlowDivider accent={accent} animate={false} />
      <span
        className="font-display text-lg shrink-0"
        style={{ color }}
      >
        {icon}
      </span>
      <GlowDivider accent={accent} animate={false} />
    </motion.div>
  )
}
