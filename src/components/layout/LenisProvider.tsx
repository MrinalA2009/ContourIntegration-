'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext)
}

interface LenisProviderProps {
  children: ReactNode
  duration?: number
}

/**
 * Wraps the application with Lenis smooth scroll.
 * Must be a client component and placed in the root layout.
 *
 * Exposes the Lenis instance via useLenisInstance() for programmatic scroll:
 *   const lenis = useLenisInstance()
 *   lenis?.scrollTo('#chapter-2', { duration: 1.5 })
 */
export function LenisProvider({ children, duration = 1.4 }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [duration])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
