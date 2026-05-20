'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { usePageScrollProgress } from '@/hooks/useScrollProgress'
import { cn } from '@/lib/cn'

interface Chapter {
  id: string
  label: string
  number: number
}

const CHAPTERS: Chapter[] = [
  { id: 'hero', label: 'Intro', number: 0 },
  { id: 'chapter-1', label: 'Complex Numbers', number: 1 },
  { id: 'chapter-2', label: 'Analyticity', number: 2 },
  { id: 'chapter-3', label: 'Integration', number: 3 },
  { id: 'chapter-4', label: 'Residues', number: 4 },
]

export function Navigation() {
  const { smoothProgress } = usePageScrollProgress()

  const navOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1])
  const navY = useTransform(smoothProgress, [0, 0.05], [-20, 0])

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left"
        style={{
          scaleX: smoothProgress,
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
        }}
      />

      {/* Floating nav pill */}
      <motion.nav
        style={{ opacity: navOpacity, y: navY }}
        className={cn(
          'fixed top-5 left-1/2 -translate-x-1/2 z-40',
          'flex items-center gap-1',
          'px-3 py-2 rounded-full',
          'bg-bg-surface/80 backdrop-blur-xl',
          'border border-white/8',
          'shadow-[0_0_0_1px_rgba(99,102,241,0.15),0_8px_32px_rgba(0,0,0,0.4)]'
        )}
        aria-label="Chapter navigation"
      >
        {CHAPTERS.map((chapter) => (
          <NavChip key={chapter.id} chapter={chapter} />
        ))}
      </motion.nav>

      {/* Chapter number indicator (bottom-right) */}
      <motion.div
        style={{ opacity: navOpacity }}
        className="fixed bottom-8 right-8 z-40 hidden lg:flex flex-col items-end gap-1"
        aria-hidden
      >
        <span className="font-mono text-[10px] tracking-widest text-content-muted uppercase">
          Scroll
        </span>
        <VerticalProgress progress={smoothProgress} chapters={CHAPTERS} />
      </motion.div>
    </>
  )
}

function NavChip({ chapter }: { chapter: Chapter }) {
  const handleClick = () => {
    const el = document.getElementById(chapter.id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-ui tracking-wide',
        'text-content-secondary hover:text-content-primary',
        'hover:bg-white/5 transition-all duration-200',
        'cursor-pointer focus-visible:outline-none',
        'focus-visible:ring-1 focus-visible:ring-accent-indigo/50'
      )}
    >
      {chapter.number > 0 && (
        <span className="text-content-muted mr-1 font-mono">{chapter.number}.</span>
      )}
      {chapter.label}
    </button>
  )
}

function VerticalProgress({
  progress,
  chapters,
}: {
  progress: MotionValue<number>
  chapters: Chapter[]
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {chapters.map((_, i) => (
        <div
          key={i}
          className="w-[1px] h-6 rounded-full bg-white/10"
        />
      ))}
    </div>
  )
}
