'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { KaTeXRenderer } from './KaTeXRenderer'
import { cn } from '@/lib/cn'
import { theoremBlock } from '@/styles/animations'
import type { TheoremData } from '@/types/math.types'

type BlockType = TheoremData['type']

interface TheoremBlockProps {
  type?: BlockType
  title?: string
  number?: string
  /** Plain-text or JSX statement */
  statement?: ReactNode
  /** LaTeX for the formal mathematical statement */
  latex?: string
  className?: string
  /** Accent color variant */
  accent?: 'indigo' | 'violet' | 'cyan' | 'gold'
  children?: ReactNode
}

const TYPE_LABELS: Record<BlockType, string> = {
  theorem: 'Theorem',
  lemma: 'Lemma',
  corollary: 'Corollary',
  definition: 'Definition',
  proposition: 'Proposition',
  remark: 'Remark',
}

const ACCENT_STYLES: Record<string, { border: string; bg: string; label: string }> = {
  indigo: {
    border: 'rgba(99,102,241,0.35)',
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)',
    label: '#818cf8',
  },
  violet: {
    border: 'rgba(139,92,246,0.35)',
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(99,102,241,0.04) 100%)',
    label: '#a78bfa',
  },
  cyan: {
    border: 'rgba(34,211,238,0.35)',
    bg: 'linear-gradient(135deg, rgba(34,211,238,0.07) 0%, rgba(99,102,241,0.04) 100%)',
    label: '#67e8f9',
  },
  gold: {
    border: 'rgba(251,191,36,0.35)',
    bg: 'linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(245,158,11,0.03) 100%)',
    label: '#fcd34d',
  },
}

/**
 * A styled mathematical statement block — theorem, lemma, definition, etc.
 * Animates in with a cinematic fade when it enters the viewport.
 *
 * Usage:
 *   <TheoremBlock type="theorem" number="1.1" title="Cauchy's Integral Theorem"
 *     statement="If f is holomorphic on a simply connected domain..."
 *     latex="\oint_\gamma f(z)\,dz = 0"
 *   />
 */
export function TheoremBlock({
  type = 'theorem',
  title,
  number,
  statement,
  latex,
  className,
  accent = 'indigo',
  children,
}: TheoremBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  const style = ACCENT_STYLES[accent]

  return (
    <motion.div
      ref={ref}
      variants={theoremBlock}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={cn('relative rounded-2xl overflow-hidden', className)}
      style={{
        border: `1px solid ${style.border}`,
        background: style.bg,
        boxShadow: `0 0 0 1px ${style.border}, 0 0 40px rgba(99,102,241,0.05), inset 0 0 50px rgba(99,102,241,0.02)`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: style.border }}
      />

      <div className="px-7 py-6 pl-9">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="font-mono text-[11px] tracking-widest uppercase font-semibold"
            style={{ color: style.label }}
          >
            {TYPE_LABELS[type]}
            {number && <span className="ml-1 opacity-70">{number}</span>}
          </span>

          {title && (
            <>
              <span className="text-content-muted text-xs">—</span>
              <span className="font-display italic text-content-secondary text-sm">
                {title}
              </span>
            </>
          )}
        </div>

        {/* Statement text */}
        {statement && (
          <p className="text-content-primary text-[0.95rem] leading-relaxed mb-4 font-ui">
            {statement}
          </p>
        )}

        {/* LaTeX formula */}
        {latex && (
          <div className="mt-3 text-content-primary text-[1.1rem]">
            <KaTeXRenderer latex={latex} display />
          </div>
        )}

        {/* Custom children (e.g. proof sketch) */}
        {children}
      </div>
    </motion.div>
  )
}
