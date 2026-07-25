import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, ArrowLeft, Github } from 'lucide-react'
import {
  PROJECTS,
  CATEGORIES,
  LANGUAGE_COLORS,
  type Category,
  type Language,
} from '@/data/projects'
import { useProjectsStore } from '@/store/useProjectsStore'
import ProjectRow from '@/components/ProjectRow'
import { cn } from '@/lib/utils'

const ALL_LANGUAGES: Language[] = ['Python', 'Java', 'Rust', 'Other']
const ALL_LICENSES = Array.from(new Set(PROJECTS.map((p) => p.license))).sort()

export default function Projects() {
  const {
    query,
    categories,
    languages,
    licenses,
    archived,
    setQuery,
    toggleCategory,
    toggleLanguage,
    toggleLicense,
    setArchived,
    reset,
  } = useProjectsStore()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PROJECTS.filter((p) => {
      if (q) {
        const hay = `${p.code} ${p.name} ${p.desc}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (categories.size && !categories.has(p.category)) return false
      if (languages.size && !languages.has(p.language)) return false
      if (licenses.size && !licenses.has(p.license)) return false
      if (archived === 'active' && p.archived) return false
      if (archived === 'archived' && !p.archived) return false
      return true
    })
  }, [query, categories, languages, licenses, archived])

  const hasFilters =
    query !== '' ||
    categories.size > 0 ||
    languages.size > 0 ||
    licenses.size > 0 ||
    archived !== 'all'

  return (
    <div className="container-page pt-28 pb-20 md:pt-36">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-num">00</span>
            <span className="eyebrow-line" />
            <span>Projects</span>
          </div>
          <h1 className="heading-lg mt-5 text-ink">
            All{' '}
            <span className="text-lime">{PROJECTS.length}</span>{' '}
            repositories
          </h1>
          <p className="lead mt-3 max-w-xl">
            Filter by direction, language, license, or status. Click any row to
            open its repository on GitHub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-ghost">
            <ArrowLeft size={14} />
            Home
          </Link>
          <a
            href="https://github.com/NDBlockConnect"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            <Github size={14} />
            Organization
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-2"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code, name, or description…"
            className="w-full rounded-full border border-line bg-surface/60 py-2.5 pl-11 pr-10 text-sm text-ink placeholder:text-muted-2 focus:border-lime/40 focus:outline-none focus:ring-2 focus:ring-lime/30"
            aria-label="Search projects"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-2 hover:text-ink"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
          {filtered.length} of {PROJECTS.length} shown
        </p>
      </div>

      {/* Body: sidebar + results */}
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Sidebar */}
        <aside className="md:col-span-3">
          <div className="sticky top-24 space-y-7">
            <FilterGroup label="Direction">
              {CATEGORIES.map((cat) => (
                <FilterCheckbox
                  key={cat.id}
                  checked={categories.has(cat.id as Category)}
                  onChange={() => toggleCategory(cat.id)}
                  count={PROJECTS.filter((p) => p.category === cat.id).length}
                  dotColor={cat.color}
                >
                  {cat.short}
                </FilterCheckbox>
              ))}
            </FilterGroup>

            <FilterGroup label="Language">
              {ALL_LANGUAGES.map((lang) => (
                <FilterCheckbox
                  key={lang}
                  checked={languages.has(lang)}
                  onChange={() => toggleLanguage(lang)}
                  count={PROJECTS.filter((p) => p.language === lang).length}
                  dotColor={LANGUAGE_COLORS[lang]}
                >
                  {lang}
                </FilterCheckbox>
              ))}
            </FilterGroup>

            <FilterGroup label="License">
              {ALL_LICENSES.map((lic) => (
                <FilterCheckbox
                  key={lic}
                  checked={licenses.has(lic)}
                  onChange={() => toggleLicense(lic)}
                  count={PROJECTS.filter((p) => p.license === lic).length}
                >
                  {lic}
                </FilterCheckbox>
              ))}
            </FilterGroup>

            <FilterGroup label="Status">
              {(['all', 'active', 'archived'] as const).map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2.5 py-1.5">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={archived === s}
                    onChange={() => setArchived(s)}
                    className="h-3.5 w-3.5 accent-lime"
                  />
                  <span className="text-sm capitalize text-muted hover:text-ink">
                    {s === 'all' ? 'All' : s}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-muted-2">
                    {s === 'all'
                      ? PROJECTS.length
                      : s === 'archived'
                        ? PROJECTS.filter((p) => p.archived).length
                        : PROJECTS.filter((p) => !p.archived).length}
                  </span>
                </label>
              ))}
            </FilterGroup>

            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="btn btn-ghost w-full !py-2 text-xs"
              >
                <X size={13} />
                Reset filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-9">
          {filtered.length === 0 ? (
            <div className="rounded-12 border border-dashed border-line bg-surface/20 px-6 py-16 text-center">
              <p className="font-display text-lg text-ink">No projects match.</p>
              <p className="mt-2 text-sm text-muted">
                Try clearing some filters or your search query.
              </p>
              <button type="button" onClick={reset} className="btn btn-primary mt-6">
                Reset filters
              </button>
            </div>
          ) : (
            <div>
              {filtered.map((project, i) => (
                <ProjectRow key={project.code} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-wide-3 text-muted-2">
        {label}
      </h3>
      <div className="mt-2.5 space-y-0.5">{children}</div>
    </div>
  )
}

function FilterCheckbox({
  checked,
  onChange,
  count,
  dotColor,
  children,
}: {
  checked: boolean
  onChange: () => void
  count: number
  dotColor?: string
  children: React.ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-8 px-2 py-1.5 transition-colors hover:bg-surface/60',
        checked && 'bg-surface/60',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-lime"
      />
      {dotColor && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
      )}
      <span className={cn('text-sm', checked ? 'text-ink' : 'text-muted')}>{children}</span>
      <span className="ml-auto font-mono text-[10px] text-muted-2">{count}</span>
    </label>
  )
}
