'use client'

import { useMemo } from 'react'
import katex from 'katex'
import { cn } from '@/lib/cn'

interface KaTeXRendererProps {
  /** LaTeX source string */
  latex: string
  /** Display mode (block) vs inline. Default false */
  display?: boolean
  className?: string
  /** Override KaTeX options */
  options?: katex.KatexOptions
  /** Color for the rendered math. Default: inherit */
  color?: string
}

/**
 * Renders a LaTeX string using KaTeX into safe HTML.
 * Requires 'katex/dist/katex.min.css' to be imported in the root layout.
 */
export function KaTeXRenderer({
  latex,
  display = false,
  className,
  options,
  color,
}: KaTeXRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        errorColor: '#fb7185',
        strict: 'ignore',
        trust: false,
        ...options,
      })
    } catch {
      return `<span style="color:#fb7185">[LaTeX error]</span>`
    }
  }, [latex, display, options])

  return (
    <span
      className={cn('katex-wrapper', className)}
      style={color ? { color } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label={`Math: ${latex}`}
    />
  )
}
