import { PROJECTS, totalStars } from '@/data/projects'
import LanguageBadge from '@/components/LanguageBadge'
import SectionHeading from '@/components/SectionHeading'

export default function OrgIntro() {
  const languages = Array.from(new Set(PROJECTS.map((p) => p.language)))
  const stars = totalStars()

  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <SectionHeading
              index={0}
              eyebrow="Organization"
              title={
                <>
                  A collective building{' '}
                  <span className="text-lime">Minecraft's</span>{' '}
                  third-party future.
                </>
              }
              lead={
                <>
                  BlockConnect is a China-based development organization
                  crafting open-source tools around Minecraft. From rendering
                  frameworks and cross-game protocol bridges to multi-core
                  performance engines and LLM-driven agents, our projects
                  orbit one goal: let players and builders do more with the
                  blocky universe they love.
                </>
              }
            />
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="grid grid-cols-2 gap-4">
              <StatCard value={String(PROJECTS.length)} label="Projects" accent="lime" />
              <StatCard value={String(stars)} label="GitHub Stars" accent="tangerine" />
              <StatCard value="6" label="Tech Directions" accent="iris" />
              <StatCard value="100%" label="Open Source" accent="ink" />
            </div>

            <div className="mt-6">
              <h3 className="font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
                Primary Languages
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <LanguageBadge key={lang} language={lang} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({
  value,
  label,
  accent,
}: {
  value: string
  label: string
  accent: 'lime' | 'tangerine' | 'iris' | 'ink'
}) {
  const color = {
    lime: 'text-lime',
    tangerine: 'text-tangerine',
    iris: 'text-iris',
    ink: 'text-ink',
  }[accent]
  return (
    <div className="rounded-12 border border-line bg-surface/40 p-5">
      <div className={`font-display text-3xl font-semibold tracking-tight-2 ${color}`}>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wide-3 text-muted-2">
        {label}
      </div>
    </div>
  )
}
