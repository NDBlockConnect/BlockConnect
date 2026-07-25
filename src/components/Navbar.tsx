import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Github, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'border-b border-line/60 bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between md:h-18">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="BlockConnect home">
          <LogoMark />
          <span className="font-display text-base font-semibold tracking-tight-2 text-ink">
            BlockConnect
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active ? 'text-lime' : 'text-muted hover:text-ink',
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <a
            href="https://github.com/NDBlockConnect"
            target="_blank"
            rel="noopener noreferrer"
            className="btn ml-2 !py-2"
            aria-label="Visit BlockConnect on GitHub"
          >
            <Github size={15} />
            GitHub
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line p-2 text-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line/60 bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'rounded-8 px-4 py-3 text-sm font-medium transition-colors',
                    active ? 'bg-lime/10 text-lime' : 'text-muted hover:bg-surface hover:text-ink',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <a
              href="https://github.com/NDBlockConnect"
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-2"
            >
              <Github size={15} />
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 64 64"
      fill="none"
      className="text-lime transition-transform duration-300 group-hover:rotate-90"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="14" width="14" height="14" rx="2" />
        <rect x="36" y="14" width="14" height="14" rx="2" />
        <rect x="14" y="36" width="14" height="14" rx="2" />
        <rect x="36" y="36" width="14" height="14" rx="2" />
        <path d="M28 21 L36 21" />
        <path d="M21 28 L21 36" />
        <path d="M28 43 L36 43" />
        <path d="M43 28 L43 36" />
      </g>
      <circle cx="32" cy="32" r="2.6" fill="#fb923c" />
    </svg>
  )
}
