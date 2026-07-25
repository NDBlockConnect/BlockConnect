import { Mail, Github, MessageSquare, ArrowUpRight } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'

export default function Contact() {
  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-16 border border-line bg-surface/40 p-10 md:p-16">
          {/* Decorative grid corner */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-tangerine/8 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative max-w-3xl">
            <SectionHeading
              index={4}
              eyebrow="Contact"
              title={
                <>
                  Build with us, or just{' '}
                  <span className="text-lime">say hi.</span>
                </>
              }
              lead="Want to contribute, report a bug, or discuss a collaboration? Reach out — we read everything."
            />

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="mailto:zechuan30@outlook.com" className="btn btn-primary">
                <Mail size={15} />
                zechuan30@outlook.com
              </a>
              <a
                href="https://github.com/NDBlockConnect"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                <Github size={15} />
                GitHub Organization
                <ArrowUpRight size={13} />
              </a>
              <a
                href="https://github.com/orgs/NDBlockConnect/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <MessageSquare size={15} />
                Discussions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
