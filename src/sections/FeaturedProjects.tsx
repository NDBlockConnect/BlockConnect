import { ArrowUpRight, Star, Archive } from 'lucide-react'
import { featuredProjects, categoryMeta, LANGUAGE_COLORS } from '@/data/projects'
import SectionHeading from '@/components/SectionHeading'

export default function FeaturedProjects() {
  const featured = featuredProjects()
  return (
    <section className="section-padding">
      <div className="container-page">
        <SectionHeading
          index={1}
          eyebrow="Featured"
          title="Most-loved projects"
          lead="Three flagship efforts that define what BlockConnect ships: a working cheat-client lineage, a live cross-game protocol, and the original archived crossplay experiment that started it all."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((project) => {
            const meta = categoryMeta(project.category)
            const langColor = LANGUAGE_COLORS[project.language]
            return (
              <a
                key={project.code}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-12 border border-line bg-surface/50 p-6 transition-all duration-300 hover:border-lime/40 hover:bg-surface hover:shadow-card-hover"
              >
                {/* Top color strip */}
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-80"
                  style={{
                    background: `linear-gradient(to right, transparent, ${meta.color}, transparent)`,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center rounded-8 border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide-2"
                    style={{
                      color: meta.color,
                      borderColor: `${meta.color}40`,
                      backgroundColor: `${meta.color}10`,
                    }}
                  >
                    {project.code}
                  </span>
                  {project.archived ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-tangerine/30 bg-tangerine/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide-2 text-tangerine">
                      <Archive size={10} />
                      Archived
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                      <Star size={12} className="text-tangerine" />
                      {project.stars}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight-2 text-ink">
                  {project.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {project.desc}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4">
                  <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-wide-2 text-muted-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: langColor }}
                      aria-hidden="true"
                    />
                    {project.language}
                    <span className="text-line">·</span>
                    {project.license}
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-2 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
                  />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
