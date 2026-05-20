'use client'

import { useRef, type ReactNode, type ElementType } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { GlowColor } from '@/styles/tokens'

type GlowVariant = 'indigo' | 'violet' | 'cyan' | 'white' | 'gold'

interface GlowTextProps {
  children: ReactNode
  as?: ElementType
  variant?: GlowVariant
  className?: string
  /** Animate in when entering the viewport */
  animate?: boolean
  /** Delay in seconds */
  delay?: number
  /** Display mode: 'inline' (default) or 'block' */
  display?: 'inline' | 'block'
  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
}

const GLOW_CLASSES: Record<GlowVariant, string> = {
  indigo: 'text-accent-indigo glow-text-indigo',
  violet: 'text-accent-violet glow-text-violet',
  cyan: 'text-accent-cyan glow-text-cyan',
  white: 'text-content-primary glow-text-white',
  gold: 'text-accent-gold glow-text-gold',
}

const WEIGHT_CLASSES: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

/**
 * Text with a configurable glow effect. Use sparingly for emphasis —
 * headline keywords, key mathematical terms, chapter titles.
 */
export function GlowText({
  children,
  as: Tag = 'span',
  variant = 'indigo',
  className,
  animate = false,
  delay = 0,
  display = 'inline',
  weight = 'normal',
}: GlowTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  const Component = animate ? (motion[Tag as keyof typeof motion] as ElementType) : Tag

  const animProps = animate
    ? {
        ref,
        initial: { opacity: 0, y: 16 },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
      }
    : { ref }

  return (
    <Component
      {...animProps}
      className={cn(
        display === 'block' ? 'block' : 'inline',
        GLOW_CLASSES[variant],
        WEIGHT_CLASSES[weight],
        className
      )}
    >
      {children}
    </Component>
  )
}

// ─── Cinematic display heading ─────────────────────────────────

interface DisplayHeadingProps {
  children: ReactNode
  className?: string
  level?: 1 | 2 | 3
  variant?: GlowVariant
  delay?: number
}

/**
 * Large cinematic heading using Cormorant Garamond.
 * Animates in with a clip reveal.
 */
export function DisplayHeading({
  children,
  className,
  level = 1,
  variant = 'white',
  delay = 0,
}: DisplayHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  const sizeClass = {
    1: 'text-display-2xl',
    2: 'text-display-xl',
    3: 'text-display-lg',
  }[level]

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : { y: '105%', opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <Tag
          className={cn(
            'font-display',
            sizeClass,
            GLOW_CLASSES[variant],
            className
          )}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  )
}
