import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Zero-indexed section number; rendered as "01", "02", etc. */
  index: number
  /** Short eyebrow label, e.g. "Rendering & Client" */
  eyebrow: string
  /** Big display title */
  title: ReactNode
  /** Optional lead paragraph below title */
  lead?: ReactNode
  className?: string
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  className,
}: SectionHeadingProps) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <div className={cn('max-w-3xl', className)}>
      <div className="eyebrow">
        <span className="eyebrow-num">{num}</span>
        <span className="eyebrow-line" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="heading-lg mt-5 text-ink">{title}</h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  )
}
