import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, PROJECTS, projectsByCategory } from '@/data/projects'
import SectionHeading from '@/components/SectionHeading'
import ProjectRow from '@/components/ProjectRow'

export default function ProjectIndex() {
  let runningIndex = 0
  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            index={3}
            eyebrow="Catalog"
            title="The full project index"
            lead="All thirteen repositories, grouped by direction. Click any row to open its GitHub repository."
          />
          <Link to="/projects" className="btn btn-ghost shrink-0">
            Filter &amp; search
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-14 space-y-14">
          {CATEGORIES.map((cat) => {
            const items = projectsByCategory(cat.id)
            if (items.length === 0) return null
            return (
              <div key={cat.id}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />
                  <h3 className="font-mono text-[11px] uppercase tracking-wide-3 text-muted">
                    {cat.label}
                  </h3>
                  <span className="font-mono text-[11px] text-muted-2">
                    · {items.length}
                  </span>
                  <span className="ml-2 h-px flex-1 bg-line-soft" />
                </div>

                <div>
                  {items.map((project) => {
                    const row = <ProjectRow key={project.code} project={project} index={runningIndex} />
                    runningIndex += 1
                    return row
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
          {PROJECTS.length} repositories · sourced from{' '}
          <a
            href="https://github.com/NDBlockConnect"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime hover:underline"
          >
            github.com/NDBlockConnect
          </a>
        </p>
      </div>
    </section>
  )
}
