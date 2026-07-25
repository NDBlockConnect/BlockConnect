import type { Language } from '@/data/projects'
import { LANGUAGE_COLORS } from '@/data/projects'
import { cn } from '@/lib/utils'

interface LanguageBadgeProps {
  language: Language
  className?: string
}

export default function LanguageBadge({ language, className }: LanguageBadgeProps) {
  const color = LANGUAGE_COLORS[language]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide-2 text-muted',
        className,
      )}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {language}
    </span>
  )
}
