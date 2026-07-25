import { Star, GitFork, ArrowUpRight, Archive } from 'lucide-react'
import type { Project } from '@/data/projects'
import { categoryMeta, LANGUAGE_COLORS } from '@/data/projects'

interface ProjectRowProps {
  project: Project
  index: number
}

/**
 * Editorial index row for a single project.
 * Layout: [index/code badge] | [name + desc + meta chips] | [stars + arrow]
 * Hover: lime left bar grows, subtle background tint, arrow shifts.
 */
export default function ProjectRow({ project, index }: ProjectRowProps) {
  const meta = categoryMeta(project.category)
  const langColor = LANGUAGE_COLORS[project.language]
  const num = String(index + 1).padStart(2, '0')

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="index-row group pl-4"
    >
      {/* Left: code badge + index number */}
      <div className="flex w-20 flex-col gap-1.5 md:w-28">
        <span
          className="inline-flex w-fit items-center rounded-8 border px-2 py-1 font-mono text-[10px] font-semibold tracking-wide-2"
          style={{
            color: meta.color,
            borderColor: `${meta.color}40`,
            backgroundColor: `${meta.color}10`,
          }}
        >
          {project.code}
        </span>
        <span className="font-mono text-[10px] text-muted-2">{num}</span>
      </div>

      {/* Middle: name + desc + meta */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-display text-lg font-semibold tracking-tight-2 text-ink">
            {project.name}
          </h3>
          {project.archived && (
            <span className="inline-flex items-center gap-1 rounded-full border border-tangerine/30 bg-tangerine/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide-2 text-tangerine">
              <Archive size={10} />
              Archived
            </span>
          )}
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
          {project.desc}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-2">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: langColor }}
              aria-hidden="true"
            />
            {project.language}
          </span>
          <span className="text-line">·</span>
          <span>{project.license}</span>
          <span className="text-line">·</span>
          <span className="uppercase tracking-wide-2">{meta.short}</span>
          <span className="text-line">·</span>
          <span>Updated {formatDate(project.updated)}</span>
        </div>
      </div>

      {/* Right: stars + arrow */}
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end gap-0.5 sm:flex">
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
            <Star size={12} className="text-tangerine" />
            {project.stars}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-2">
            <GitFork size={10} />
            {project.forks}
          </span>
        </div>
        <ArrowUpRight
          size={18}
          className="text-muted-2 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
        />
      </div>
    </a>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
