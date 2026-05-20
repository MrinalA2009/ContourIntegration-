'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export interface LenisOptions {
  duration?: number
  wheelMultiplier?: number
  touchMultiplier?: number
}

/**
 * Initializes Lenis smooth scroll and drives it via requestAnimationFrame.
 * Returns the Lenis instance ref for programmatic control (e.g. lenis.scrollTo).
 */
export function useLenis(options?: LenisOptions) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: options?.duration ?? 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: options?.wheelMultiplier ?? 0.85,
      touchMultiplier: options?.touchMultiplier ?? 1.5,
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
  }, [options?.duration, options?.wheelMultiplier, options?.touchMultiplier])

  return lenisRef
}
