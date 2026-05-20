'use client'

import { forwardRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface SceneWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  /** Show a subtle grid overlay */
  grid?: boolean
  /** Background variant */
  bg?: 'base' | 'surface' | 'elevated' | 'transparent'
  /** Centered layout or custom */
  center?: boolean
}

/**
 * Full-screen scene container. Every scene in the presentation
 * is wrapped by this component.
 *
 * Layout: position:relative, w-full, h-screen (or min-h-screen),
 * overflow hidden.
 */
const SceneWrapper = forwardRef<HTMLElement, SceneWrapperProps>(
  ({ children, className, id, grid = false, bg = 'base', center = true }, ref) => {
    const bgClass = {
      base: 'bg-bg-base',
      surface: 'bg-bg-surface',
      elevated: 'bg-bg-elevated',
      transparent: 'bg-transparent',
    }[bg]

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'relative w-full h-screen overflow-hidden',
          bgClass,
          center && 'flex items-center justify-center',
          className
        )}
      >
        {/* Subtle grid overlay */}
        {grid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
            }}
            aria-hidden
          />
        )}

        {/* Content */}
        {children}
      </section>
    )
  }
)

SceneWrapper.displayName = 'SceneWrapper'
export { SceneWrapper }
