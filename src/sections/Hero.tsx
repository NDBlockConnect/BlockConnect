import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, ArrowDown } from 'lucide-react'
import { PROJECTS, CATEGORIES } from '@/data/projects'

const ConstellationScene = lazy(() => import('../three/ConstellationScene'))

export default function Hero() {
  const projectCount = PROJECTS.length
  const directionCount = CATEGORIES.length
  const languages = new Set(PROJECTS.map((p) => p.language)).size

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* WebGL background */}
      <div className="absolute inset-0">
        <Suspense fallback={<HeroFallback />}>
          <ConstellationScene className="absolute inset-0 h-full w-full" />
        </Suspense>
      </div>

      {/* Gradient overlays for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/30" />

      <div className="container-page relative flex min-h-[100svh] flex-col justify-end pb-20 pt-32 md:pb-24">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="chip chip-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-soft" />
              Minecraft Tooling Collective
            </span>
            <span className="chip">China · est. 2026</span>
          </div>

          <h1 className="heading-xl mt-6 text-ink">
            Block
            <span className="text-lime">Connect</span>
          </h1>

          <p className="lead mt-6 max-w-xl">
            Third-party tools for Minecraft, by builders who play. Thirteen
            open-source projects spanning rendering, crossplay, performance,
            AI, launchers, and tooling — one constellation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/projects" className="btn btn-primary">
              Explore Projects
              <ArrowRight size={14} />
            </Link>
            <a
              href="https://github.com/NDBlockConnect"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <Github size={15} />
              Visit GitHub
            </a>
          </div>

          {/* Quick stats */}
          <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line/60 pt-8 sm:grid-cols-4">
            <Stat label="Projects" value={String(projectCount)} accent="lime" />
            <Stat label="Languages" value={String(languages)} accent="tangerine" />
            <Stat label="Directions" value={String(directionCount)} accent="iris" />
            <Stat label="Open Source" value="100%" accent="ink" />
          </dl>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-wide-3 text-muted-2">
          scroll
        </span>
        <ArrowDown size={12} className="text-muted-2 animate-pulse-soft" />
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'lime' | 'tangerine' | 'iris' | 'ink'
}) {
  const color = {
    lime: 'text-lime',
    tangerine: 'text-tangerine',
    iris: 'text-iris',
    ink: 'text-ink',
  }[accent]
  return (
    <div>
      <dd className={`font-display text-2xl font-semibold tracking-tight-2 ${color}`}>
        {value}
      </dd>
      <dt className="mt-1 font-mono text-[10px] uppercase tracking-wide-3 text-muted-2">
        {label}
      </dt>
    </div>
  )
}

function HeroFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0d1018] to-[#0c0e13]">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-3xl" />
    </div>
  )
}
