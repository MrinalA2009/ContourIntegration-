'use client'

import { useRef } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

interface UsePinnedSectionResult {
  /** Attach to the outer scroll container */
  containerRef: RefObject<HTMLDivElement>
  /** 0→1 as the outer container scrolls through the viewport */
  progress: MotionValue<number>
  /** CSS height to apply to the outer container (e.g. "300vh") */
  containerHeight: string
}

/**
 * Powers a "sticky" scroll-driven scene.
 *
 * The outer container is `duration × 100vh` tall so it takes `duration`
 * viewport-heights of scroll to traverse. Inside, content is `position:sticky`
 * so it stays pinned while progress drives the animation.
 *
 * @param duration  Scroll duration as a multiple of viewport height. Default 3.
 */
export function usePinnedSection(duration = 3): UsePinnedSectionResult {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return {
    containerRef,
    progress: scrollYProgress,
    containerHeight: `${duration * 100}vh`,
  }
}
