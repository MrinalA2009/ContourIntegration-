import type { MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'

export interface SceneProps {
  progress?: MotionValue<number>
  className?: string
  children?: ReactNode
}

export interface PinnedSceneProps {
  /** Render prop receives a 0→1 MotionValue tied to scroll through this scene */
  children: (progress: MotionValue<number>) => ReactNode
  /** How many viewport-heights to pin for (controls animation duration). Default 3 */
  duration?: number
  id?: string
  className?: string
}

export interface ScrollSceneProps {
  children: ReactNode
  className?: string
  /** Fade in as the scene enters the viewport */
  fadeIn?: boolean
  /** Fade out as the scene exits the viewport */
  fadeOut?: boolean
  id?: string
}

export interface SceneTransitionProps {
  /** Array of scene render functions, each receiving a local 0→1 progress */
  scenes: Array<(progress: MotionValue<number>) => ReactNode>
  /** Global 0→1 progress value that drives which scene is active */
  progress: MotionValue<number>
}

export interface TimelineStage {
  /** Input progress range [start, end] where 0 ≤ start < end ≤ 1 */
  input: [number, number]
  /** Output value range [from, to] */
  output: [number, number]
}

export interface ScrollTimelineHook {
  scrollYProgress: MotionValue<number>
  /** Create a derived MotionValue for a sub-range of scroll progress */
  segment: (inputStart: number, inputEnd: number, outputStart: number, outputEnd: number) => MotionValue<number>
  /** Create a derived MotionValue with arbitrary keyframes */
  range: (inputRange: number[], outputRange: number[]) => MotionValue<number>
}

export type SceneVariant = 'hero' | 'pinned' | 'scroll' | 'split' | 'fullbleed'
