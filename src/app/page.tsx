'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { PinnedScene } from '@/components/scene/PinnedScene'
import { ScrollScene } from '@/components/scene/ScrollScene'
import { SceneWrapper } from '@/components/scene/SceneWrapper'
import { TheoremBlock } from '@/components/math/TheoremBlock'
import { AnimatedEquation } from '@/components/math/AnimatedEquation'
import { EquationSteps } from '@/components/math/EquationStep'
import { ComplexPlane } from '@/components/canvas/ComplexPlane'
import { ContourRenderer } from '@/components/canvas/ContourRenderer'
import { CoordinateSystem } from '@/components/canvas/CoordinateSystem'
import { AnimatedArrow, ComplexPoint } from '@/components/canvas/AnimatedArrow'
import { VectorField } from '@/components/canvas/VectorField'
import { GlowText, DisplayHeading } from '@/components/ui/GlowText'
import { SectionLabel, OverlineLabel } from '@/components/ui/SectionLabel'
import { GlowDivider, SectionDivider } from '@/components/ui/GlowDivider'
import { circleContour, lineContour, complex, div } from '@/lib/complexMath'

// ─── Page ──────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroScene />
      <FrameworkDemoScene />
      <MathComponentShowcase />
      <CanvasShowcase />
      <ChapterPreview />
      <FooterScene />
    </>
  )
}

// ─── 1. Hero ───────────────────────────────────────────────────

function HeroScene() {
  return (
    <SceneWrapper id="hero" grid center className="min-h-screen">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full animate-glow-breathe"
          style={{
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-glow-breathe"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Background complex plane */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" aria-hidden>
        <ComplexPlane
          domain={{ xMin: -5, xMax: 5, yMin: -5, yMax: 5 }}
          viewBoxWidth={800}
          viewBoxHeight={800}
          showLabels={false}
          gridColor="rgba(99,102,241,0.15)"
          axisColor="rgba(99,102,241,0.35)"
          className="w-full h-full"
        >
          <CoordinateSystem />
        </ComplexPlane>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <OverlineLabel accent="indigo" delay={0.2}>
          A visual journey
        </OverlineLabel>

        <div className="mt-6 mb-4">
          <DisplayHeading level={1} variant="white" delay={0.35}>
            Contour
          </DisplayHeading>
          <DisplayHeading level={1} variant="indigo" delay={0.5}>
            Integration
          </DisplayHeading>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
          className="mt-6 text-content-secondary font-ui text-lg max-w-xl leading-relaxed text-balance"
        >
          A cinematic exploration of complex analysis — from the algebra of{' '}
          <GlowText variant="cyan">ℂ</GlowText> to the power of{' '}
          <GlowText variant="indigo">residues</GlowText>.
        </motion.p>

        {/* Hero equation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          className="mt-12 p-6 rounded-2xl border border-white/8 bg-bg-surface/50 backdrop-blur-sm
                     shadow-[0_0_60px_rgba(99,102,241,0.08)]"
        >
          <AnimatedEquation
            latex="\oint_\gamma f(z)\,dz = 2\pi i \sum_{k} \mathrm{Res}(f, z_k)"
            fontSize="clamp(1.1rem, 2.8vw, 1.6rem)"
            glowClass="glow-text-indigo"
            animate={false}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest text-content-muted uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-gradient-to-b from-accent-indigo/60 to-transparent"
          />
        </motion.div>
      </div>
    </SceneWrapper>
  )
}

// ─── 2. Scroll-engine demo ─────────────────────────────────────

function FrameworkDemoScene() {
  return (
    <PinnedScene id="chapter-1" duration={4} grid>
      {(progress) => <FrameworkSceneContent progress={progress} />}
    </PinnedScene>
  )
}

// Named component so hooks are legal
function FrameworkSceneContent({ progress }: { progress: MotionValue<number> }) {
  const canvasProgress = useTransform(progress, [0.1, 0.9], [0, 1])

  const STEPS = [
    { latex: 'f : \\mathbb{C} \\to \\mathbb{C}', label: 'A complex function' },
    {
      latex: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y},\\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
      label: 'Cauchy–Riemann equations',
    },
    { latex: '\\oint_\\gamma f(z)\\,dz = 0', label: "Cauchy's integral theorem" },
    {
      latex: 'f(z_0) = \\dfrac{1}{2\\pi i} \\oint_\\gamma \\dfrac{f(z)}{z - z_0}\\,dz',
      label: "Cauchy's integral formula",
    },
  ]

  return (
    <div className="w-full h-full flex items-center scene-px">
      {/* Left: equations */}
      <div className="flex-1 max-w-xl pr-8">
        <SectionLabel chapter="§ 1" label="The framework in action" accent="indigo" className="mb-8" />

        <p className="text-content-secondary font-ui text-sm mb-10 leading-relaxed">
          As you scroll, this scene stays pinned. The progress bar shows scroll
          position driving every animation simultaneously.
        </p>

        <EquationSteps
          steps={STEPS}
          progress={progress}
          fontSize="clamp(0.85rem, 1.8vw, 1.15rem)"
          showArrows
        />

        <ProgressBar progress={progress} className="mt-12" />
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:flex h-64 self-center mx-8">
        <GlowDivider orientation="vertical" accent="indigo" />
      </div>

      {/* Right: complex plane */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="w-full max-w-md aspect-square">
          <ComplexPlane domain={{ xMin: -2.5, xMax: 2.5, yMin: -2.5, yMax: 2.5 }}>
            <CoordinateSystem progress={canvasProgress} progressRange={[0, 0.2]} />
            <ContourRenderer
              path={{ fn: circleContour(complex(0), 1), resolution: 200, closed: true }}
              progress={canvasProgress}
              progressRange={[0.15, 0.55]}
              color="#6366f1"
              label="γ"
              showArrow
            />
            <AnimatedArrow
              from={complex(0)}
              to={complex(0.707, 0.707)}
              color="#22d3ee"
              progress={canvasProgress}
              progressRange={[0.45, 0.68]}
              label="z₀"
            />
            <ComplexPoint
              z={complex(0, 0)}
              color="#8b5cf6"
              label="0"
              progress={canvasProgress}
              progressRange={[0, 0.12]}
            />
          </ComplexPlane>
        </div>
      </div>
    </div>
  )
}

// ─── 3. Math component showcase ────────────────────────────────

function MathComponentShowcase() {
  return (
    <ScrollScene id="chapter-2" fadeIn fadeOut className="min-h-screen py-32">
      <div className="w-full max-w-5xl mx-auto scene-px">
        <SectionLabel chapter="§ 2" label="Component library" accent="violet" className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TheoremBlock
            type="theorem"
            number="2.1"
            title="Cauchy's Integral Theorem"
            accent="indigo"
            statement="Let f be holomorphic on a simply connected open domain D ⊆ ℂ. Then for any closed contour γ in D:"
            latex="\oint_\gamma f(z)\,dz = 0"
          />
          <TheoremBlock
            type="definition"
            number="2.2"
            title="Residue"
            accent="violet"
            statement="The residue of f at an isolated singularity z₀ is the coefficient of (z − z₀)⁻¹ in the Laurent series:"
            latex="\mathrm{Res}(f, z_0) = \frac{1}{2\pi i} \oint_\gamma f(z)\,dz"
          />
          <TheoremBlock
            type="corollary"
            number="2.3"
            title="Residue Theorem"
            accent="cyan"
            statement="If f is meromorphic inside γ with poles at z₁, …, zₙ:"
            latex="\oint_\gamma f(z)\,dz = 2\pi i \sum_{k=1}^n \mathrm{Res}(f, z_k)"
          />
          <TheoremBlock
            type="remark"
            accent="gold"
            statement="The residue theorem reduces contour integrals to simple algebraic sums. This is the central miracle of complex analysis."
          />
        </div>

        <SectionDivider accent="violet" className="mt-20" />

        <div className="mt-20 text-center">
          <OverlineLabel accent="cyan" className="mb-8 justify-center">
            Animated equations
          </OverlineLabel>
          <div className="space-y-8">
            <AnimatedEquation
              latex="z = x + iy = r e^{i\theta} = r(\cos\theta + i\sin\theta)"
              fontSize="clamp(1rem, 2.5vw, 1.4rem)"
              delay={100}
            />
            <AnimatedEquation
              latex="\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}"
              fontSize="clamp(1rem, 2.5vw, 1.4rem)"
              delay={250}
              glowClass="glow-text-cyan"
            />
            <AnimatedEquation
              latex="\sum_{n=0}^{\infty} \frac{(-1)^n}{2n+1} = \frac{\pi}{4}"
              fontSize="clamp(1rem, 2.5vw, 1.4rem)"
              delay={400}
              glowClass="glow-text-violet"
            />
          </div>
        </div>
      </div>
    </ScrollScene>
  )
}

// ─── 4. Canvas showcase ────────────────────────────────────────

function CanvasShowcase() {
  return (
    <PinnedScene id="chapter-3" duration={3}>
      {(progress) => <CanvasSceneContent progress={progress} />}
    </PinnedScene>
  )
}

function CanvasSceneContent({ progress }: { progress: MotionValue<number> }) {
  const planeProgress = useTransform(progress, [0, 0.45], [0, 1])
  const fieldProgress = useTransform(progress, [0.45, 0.9], [0, 1])

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center scene-px gap-8">
      <div className="flex-none w-full lg:w-80 flex flex-col gap-6">
        <SectionLabel chapter="§ 3" label="Canvas visualizations" accent="cyan" />
        <p className="text-content-secondary text-sm leading-relaxed">
          The <GlowText variant="cyan">ComplexPlane</GlowText> component hosts
          any combination of contours, arrows, points, and vector fields. Everything
          responds to scroll progress.
        </p>
        <div className="space-y-3 text-xs font-mono text-content-muted">
          <ComponentTag name="ComplexPlane" color="#6366f1" />
          <ComponentTag name="ContourRenderer" color="#22d3ee" indent />
          <ComponentTag name="CoordinateSystem" color="#8b5cf6" indent />
          <ComponentTag name="AnimatedArrow" color="#10b981" indent />
          <ComponentTag name="VectorField" color="#fbbf24" indent />
          <ComponentTag name="ComplexPoint" color="#fb7185" indent />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[480px] aspect-square">
          <ComplexPlane
            domain={{ xMin: -3, xMax: 3, yMin: -3, yMax: 3 }}
            showLabels={false}
            gridColor="rgba(99,102,241,0.07)"
            axisColor="rgba(99,102,241,0.22)"
          >
            <CoordinateSystem progress={planeProgress} progressRange={[0, 0.3]} />

            {/* Semicircle contour */}
            <ContourRenderer
              path={{ fn: circleContour(complex(0), 2, 0, Math.PI), resolution: 150 }}
              progress={planeProgress}
              progressRange={[0.2, 0.6]}
              color="#6366f1"
              label="C_R"
              strokeWidth={2.5}
            />

            {/* Diameter */}
            <ContourRenderer
              path={{ fn: lineContour(complex(-2), complex(2)) }}
              progress={planeProgress}
              progressRange={[0.5, 0.78]}
              color="#22d3ee"
              strokeWidth={2}
              showArrow
            />

            {/* Poles */}
            <ComplexPoint z={complex(0, 1)} color="#fb7185" label="i" radius={5}
              progress={planeProgress} progressRange={[0.65, 0.82]} />
            <ComplexPoint z={complex(0, -1)} color="#fbbf24" label="-i" radius={5}
              progress={planeProgress} progressRange={[0.65, 0.82]} />

            {/* Vector field */}
            <VectorField
              fn={(z) => {
                const d = z.re * z.re + z.im * z.im
                if (d < 0.04) return { re: 0, im: 0 }
                return { re: z.re / d, im: -z.im / d }
              }}
              gridDensity={10}
              maxLength={18}
              colorMode="argument"
              progress={fieldProgress}
              progressRange={[0, 1]}
              opacity={0.5}
            />
          </ComplexPlane>
        </div>
      </div>
    </div>
  )
}

// ─── 5. Chapter preview ────────────────────────────────────────

const UPCOMING_CHAPTERS = [
  {
    number: '01',
    title: 'Complex Numbers',
    desc: 'Algebra, geometry, and the polar form. Why ℂ is more than ℝ².',
    accent: '#6366f1',
    equation: 'z = re^{i\\theta}',
  },
  {
    number: '02',
    title: 'Analytic Functions',
    desc: 'The Cauchy–Riemann equations and what it means to be differentiable in ℂ.',
    accent: '#8b5cf6',
    equation: '\\frac{\\partial f}{\\partial \\bar{z}} = 0',
  },
  {
    number: '03',
    title: 'Contour Integration',
    desc: "Integrating along curves in ℂ. Cauchy's theorem and its consequences.",
    accent: '#22d3ee',
    equation: '\\oint_\\gamma f\\,dz = 0',
  },
  {
    number: '04',
    title: 'The Residue Theorem',
    desc: 'Computing real integrals with complex residues. The power of analytic continuation.',
    accent: '#fb7185',
    equation: '\\sum_k \\mathrm{Res}(f, z_k)',
  },
]

function ChapterPreview() {
  return (
    <ScrollScene id="chapter-4" fadeIn className="min-h-screen py-32">
      <div className="w-full max-w-6xl mx-auto scene-px">
        <div className="text-center mb-16">
          <OverlineLabel accent="gold" className="justify-center mb-4">
            Upcoming
          </OverlineLabel>
          <DisplayHeading level={2} variant="white">
            The Journey Ahead
          </DisplayHeading>
          <p className="mt-4 text-content-muted font-ui text-sm max-w-md mx-auto">
            Each chapter is a scroll-driven scene. The framework above powers every one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_CHAPTERS.map((ch, i) => (
            <ChapterCard key={ch.number} chapter={ch} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </ScrollScene>
  )
}

function ChapterCard({
  chapter,
  delay,
}: {
  chapter: (typeof UPCOMING_CHAPTERS)[number]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className="group relative rounded-2xl p-6 border border-white/6 bg-bg-surface/60
                 hover:border-white/12 transition-all duration-300 cursor-pointer
                 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]"
    >
      <div
        className="font-mono text-[11px] tracking-widest mb-4 uppercase"
        style={{ color: chapter.accent }}
      >
        Ch. {chapter.number}
      </div>

      <div className="mb-4 opacity-50 group-hover:opacity-80 transition-opacity duration-300 text-[0.85rem]">
        <AnimatedEquation latex={chapter.equation} display={false} animate={false} />
      </div>

      <h3 className="font-display text-lg text-content-primary mb-2 italic">
        {chapter.title}
      </h3>

      <p className="font-ui text-xs text-content-muted leading-relaxed">{chapter.desc}</p>

      <div
        className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full opacity-0
                   group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${chapter.accent}80, transparent)` }}
      />

      <div className="absolute top-4 right-4">
        <span className="font-mono text-[9px] tracking-widest text-content-muted/50 uppercase bg-white/4 px-2 py-1 rounded-full">
          Soon
        </span>
      </div>
    </motion.div>
  )
}

// ─── 6. Footer ─────────────────────────────────────────────────

function FooterScene() {
  return (
    <ScrollScene fadeIn className="min-h-[40vh] py-24">
      <div className="w-full max-w-5xl mx-auto scene-px flex flex-col items-center text-center gap-6">
        <GlowDivider accent="indigo" className="max-w-xs" />

        <p className="font-display italic text-display-md text-content-primary glow-text-white">
          ∮
        </p>

        <p className="font-ui text-content-muted text-sm max-w-sm leading-relaxed">
          Built with{' '}
          <GlowText variant="indigo">Next.js</GlowText>,{' '}
          <GlowText variant="violet">Framer Motion</GlowText>,{' '}
          <GlowText variant="cyan">Lenis</GlowText>, and{' '}
          <GlowText variant="gold">KaTeX</GlowText>.
          <br />
          The framework for cinematic mathematical storytelling.
        </p>

        <span className="font-mono text-[10px] tracking-widest text-content-muted/40 uppercase">
          Contour Integration · Framework v0.1
        </span>
      </div>
    </ScrollScene>
  )
}

// ─── Shared sub-components ─────────────────────────────────────

function ProgressBar({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const displayValue = useTransform(progress, (v: number) => `${(v * 100).toFixed(0)}%`)

  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] tracking-widest text-content-muted uppercase">
          Scroll progress
        </span>
        <motion.span className="font-mono text-[10px] text-accent-indigo">
          {displayValue}
        </motion.span>
      </div>
      <div className="h-[2px] w-full bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            scaleX: progress,
            transformOrigin: 'left center',
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
          }}
        />
      </div>
    </div>
  )
}

function ComponentTag({ name, color, indent }: { name: string; color: string; indent?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${indent ? 'pl-4' : ''}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span style={{ color }} className="opacity-80">
        &lt;{name} /&gt;
      </span>
    </div>
  )
}
