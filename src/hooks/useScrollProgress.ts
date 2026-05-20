'use client'

import { useRef } from 'react'
import { useScroll, useSpring, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

interface UseScrollProgressResult {
  ref: RefObject<HTMLElement>
  /** Raw scroll progress 0→1, updates every frame */
  progress: MotionValue<number>
  /** Spring-smoothed version — feels more physical for parallax */
  smoothProgress: MotionValue<number>
}

/**
 * Tracks scroll progress of a container from its entry to exit in the viewport.
 * offset controls when 0 and 1 are reached relative to the viewport.
 */
export function useScrollProgress(
  offset: [string, string] = ['start end', 'end start'],
  springConfig = { stiffness: 80, damping: 25, mass: 1 }
): UseScrollProgressResult {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    // framer-motion's offset type is overly strict; string literals are valid at runtime
    // eslint-disable-next-line
    offset: offset as any,
  })

  const smoothProgress = useSpring(scrollYProgress, {
    ...springConfig,
    restDelta: 0.0005,
  })

  return { ref, progress: scrollYProgress, smoothProgress }
}

/**
 * Global page scroll progress (0 at top, 1 at bottom).
 * Does not require a ref target.
 */
export function usePageScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  return { progress: scrollYProgress, smoothProgress }
}
