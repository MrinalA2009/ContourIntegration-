'use client'

import { useRef } from 'react'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'
import type { ScrollTimelineHook } from '@/types/scene.types'

/**
 * Attaches to a container element and returns scroll-progress utilities.
 *
 * Usage:
 *   const { ref, segment, range } = useScrollTimeline()
 *   const opacity = segment(0, 0.3, 0, 1)   // fade in during first 30% of scroll
 *   const x      = range([0, 0.5, 1], [0, 100, 0])
 */
export function useScrollTimeline(
  offset: [string, string] = ['start start', 'end end']
): ScrollTimelineHook & { ref: RefObject<HTMLDivElement> } {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    // framer-motion's offset type is overly strict; string literals are valid at runtime
    // eslint-disable-next-line
    offset: offset as any,
  })

  function segment(
    inputStart: number,
    inputEnd: number,
    outputStart: number,
    outputEnd: number
  ): MotionValue<number> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollYProgress, [inputStart, inputEnd], [outputStart, outputEnd])
  }

  function range(
    inputRange: number[],
    outputRange: number[]
  ): MotionValue<number> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollYProgress, inputRange, outputRange)
  }

  return { ref, scrollYProgress, segment, range }
}

/**
 * A standalone hook that maps a MotionValue<number> (progress 0→1) to
 * sub-ranges without needing a DOM ref. Useful inside PinnedScene children.
 */
export function useProgressMap(
  progress: MotionValue<number>,
  inputRange: number[],
  outputRange: number[]
): MotionValue<number> {
  return useTransform(progress, inputRange, outputRange)
}
