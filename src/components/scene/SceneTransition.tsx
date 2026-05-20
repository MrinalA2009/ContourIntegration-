'use client'

import { type ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'

interface Stage {
  /** Render function for this stage, receives local 0→1 progress */
  render: (localProgress: MotionValue<number>) => ReactNode
  /** Width of this stage as a fraction of total progress [0, 1] */
  weight?: number
}

interface SceneTransitionProps {
  /** Global 0→1 scroll progress driving the whole sequence */
  progress: MotionValue<number>
  /** Sequential stages that share the progress timeline */
  stages: Stage[]
}

/**
 * Splits a single 0→1 progress value into multiple sequential stages.
 * Each stage receives a local 0→1 progress representing its own slice.
 *
 * Example: 3 equal stages each get [0,0.33], [0.33,0.66], [0.66,1.0]
 * of the global progress. They cross-fade at boundaries.
 */
export function SceneTransition({ progress, stages }: SceneTransitionProps) {
  const totalWeight = stages.reduce((sum, s) => sum + (s.weight ?? 1), 0)

  let cursor = 0
  const slices = stages.map((stage) => {
    const weight = stage.weight ?? 1
    const start = cursor / totalWeight
    const end = (cursor + weight) / totalWeight
    cursor += weight
    return { stage, start, end }
  })

  return (
    <div className="relative w-full h-full">
      {slices.map(({ stage, start, end }, i) => (
        <StageLayer
          key={i}
          progress={progress}
          globalStart={start}
          globalEnd={end}
          render={stage.render}
          isFirst={i === 0}
          isLast={i === slices.length - 1}
        />
      ))}
    </div>
  )
}

interface StageLayerProps {
  progress: MotionValue<number>
  globalStart: number
  globalEnd: number
  render: (localProgress: MotionValue<number>) => ReactNode
  isFirst: boolean
  isLast: boolean
}

function StageLayer({
  progress,
  globalStart,
  globalEnd,
  render,
  isFirst,
  isLast,
}: StageLayerProps) {
  const FADE = 0.04

  // Layer opacity: fade in at globalStart, full during active range, fade out at globalEnd
  const opacity = useTransform(
    progress,
    [
      Math.max(0, globalStart - FADE),
      globalStart + FADE,
      Math.max(globalStart + FADE * 2, globalEnd - FADE),
      Math.min(1, globalEnd + FADE),
    ],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
  )

  // Local 0→1 progress for just this stage's slice
  const localProgress = useTransform(progress, [globalStart, globalEnd], [0, 1])

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 will-change-[opacity]"
    >
      {render(localProgress)}
    </motion.div>
  )
}
