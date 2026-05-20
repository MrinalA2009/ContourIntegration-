'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ScrollSceneProps {
  children: ReactNode
  className?: string
  id?: string
  /** Fade in as the scene enters the viewport from below. Default true */
  fadeIn?: boolean
  /** Fade out as the scene exits upward. Default false */
  fadeOut?: boolean
  /** Y translation distance for the entrance. Default 40 */
  yOffset?: number
}

/**
 * A full-screen scene that gracefully fades in (and optionally out)
 * as the user scrolls to it. No pinning — it scrolls normally.
 *
 * Ideal for section breaks, intros, and bridging scenes between
 * PinnedScene blocks.
 */
export function ScrollScene({
  children,
  className,
  id,
  fadeIn = true,
  fadeOut = false,
  yOffset = 50,
}: ScrollSceneProps) {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(
    scrollYProgress,
    fadeIn && fadeOut
      ? [0, 0.2, 0.8, 1]
      : fadeIn
      ? [0, 0.25, 1, 1]
      : fadeOut
      ? [1, 1, 0.75, 0]
      : [1, 1, 1, 1],
    fadeIn && fadeOut
      ? [0, 1, 1, 0]
      : fadeIn
      ? [0, 1, 1, 1]
      : fadeOut
      ? [1, 1, 1, 0]
      : [1, 1, 1, 1]
  )

  const y = useTransform(
    scrollYProgress,
    [0, 0.25, 1],
    fadeIn ? [yOffset, 0, 0] : [0, 0, 0]
  )

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ opacity, y }}
      className={cn(
        'relative w-full min-h-screen overflow-hidden',
        'bg-bg-base flex items-center justify-center',
        className
      )}
    >
      {children}
    </motion.section>
  )
}
