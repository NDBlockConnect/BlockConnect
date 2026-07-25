import { Boxes, Network, Gauge, Brain, Rocket, Building2 } from 'lucide-react'
import { CATEGORIES, PROJECTS } from '@/data/projects'
import SectionHeading from '@/components/SectionHeading'
import type { Category } from '@/data/projects'

const ICONS: Record<Category, typeof Boxes> = {
  rendering: Boxes,
  crossplay: Network,
  performance: Gauge,
  ai: Brain,
  launcher: Rocket,
  meta: Building2,
}

const DESCRIPTIONS: Record<Category, string> = {
  rendering: 'Rendering frameworks and client-side mods that change what players see and feel.',
  crossplay: 'Protocol bridges connecting Minecraft to other games and mod loaders.',
  performance: 'JVM-level engines squeezing more frames out of Minecraft Java.',
  ai: 'Mods that let language models play Minecraft via APIs and MCP servers.',
  launcher: 'Cross-platform launchers and tooling that improve the player workflow.',
  meta: 'Organization-level repositories, including this very website.',
}

export default function TechDirections() {
  return (
    <section className="section-padding">
      <div className="container-page">
        <SectionHeading
          index={2}
          eyebrow="Directions"
          title="Six directions, one constellation"
          lead="Every project belongs to one of six technical directions. Together they form the constellation you saw in the hero — a portfolio balanced across the Minecraft ecosystem."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.id]
            const count = PROJECTS.filter((p) => p.category === cat.id).length
            return (
              <div
                key={cat.id}
                className="group relative overflow-hidden rounded-12 border border-line bg-surface/40 p-6 transition-all duration-300 hover:bg-surface"
              >
                {/* Hover accent line */}
                <div
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: cat.color }}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-10 border"
                    style={{
                      color: cat.color,
                      borderColor: `${cat.color}40`,
                      backgroundColor: `${cat.color}10`,
                    }}
                  >
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wide-3 text-muted-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight-2 text-ink">
                  {cat.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {DESCRIPTIONS[cat.id]}
                </p>

                <div className="mt-5 flex items-center gap-2 font-mono text-[11px] text-muted-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />
                  {count} {count === 1 ? 'project' : 'projects'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
