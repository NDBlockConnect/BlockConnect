import { Link } from 'react-router-dom'
import { Github, Mail, Globe } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-line/60 bg-bg">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <g stroke="#bef264" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
              <span className="font-display text-base font-semibold tracking-tight-2 text-ink">
                BlockConnect
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A third-party tool development organization for Minecraft.
              Thirteen open-source projects across six directions.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-wide-3 text-muted-2">
              Block Connect to Play.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-muted transition-colors hover:text-lime">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted transition-colors hover:text-lime">
                  Projects
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/NDBlockConnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-lime"
                >
                  GitHub Organization
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/orgs/NDBlockConnect/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-lime"
                >
                  Discussions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:zechuan30@outlook.com"
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-lime"
                >
                  <Mail size={14} />
                  zechuan30@outlook.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/NDBlockConnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-lime"
                >
                  <Github size={14} />
                  /NDBlockConnect
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-muted-2">
                <Globe size={14} />
                blockconnect.n0th1n3ssd0ma1n.top
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line-soft pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
            © {year} BlockConnect · China
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wide-3 text-muted-2">
            Built with React · Vite · Three.js
          </p>
        </div>
      </div>
    </footer>
  )
}
