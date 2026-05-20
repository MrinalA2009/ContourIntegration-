'use client'

import { useRef, type ReactNode } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/cn'

interface PinnedSceneProps {
  /**
   * Render prop. Receives a MotionValue<number> (0→1) that progresses
   * as the outer scroll container moves through the viewport.
   * Use this to drive every animation inside the scene.
   */
  children: (progress: MotionValue<number>) => ReactNode
  /**
   * Duration as a multiple of 100vh. duration=3 means the scene
   * occupies 300vh of scroll before releasing the pin. Default: 3
   */
  duration?: number
  id?: string
  className?: string
  /** Show a grid in the pinned content area */
  grid?: boolean
}

/**
 * Scroll-pinned scene engine.
 *
 * Architecture:
 *   <outer div>  ← tall container (duration × 100vh)
 *     <inner div> ← sticky at top, always 100vh visible
 *       {children(progress)}
 *     </inner div>
 *   </outer div>
 *
 * As the outer div scrolls through the viewport, `progress` moves 0→1,
 * giving you a precise timeline to animate against.
 */
export function PinnedScene({
  children,
  duration = 3,
  id,
  className,
  grid = false,
}: PinnedSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn('relative w-full', className)}
      style={{ height: `${duration * 100}vh` }}
    >
      {/* Pinned viewport */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden bg-bg-base"
      >
        {/* Optional grid */}
        {grid && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 100%)',
            }}
            aria-hidden
          />
        )}

        {/* Scene content driven by scroll progress */}
        <div className="relative z-10 w-full h-full">
          {children(scrollYProgress)}
        </div>
      </div>
    </div>
  )
}
