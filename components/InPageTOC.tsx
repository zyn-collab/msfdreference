'use client'

import { useEffect, useState, useRef } from 'react'
import type { Heading } from '@/lib/types'

// Extract section number like "4.1" from heading text
function getSectionNum(text: string): string | null {
  const m = text.match(/^(\d+\.\d+)\s/)
  return m ? m[1] : null
}

// Strip section number prefix for display
function getDisplayText(text: string): string {
  return text.replace(/^\d+\.\d+\s+/, '')
}

export default function InPageTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const tocRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top
          })
          setActiveId(sorted[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])


  if (headings.length === 0) return null

  const h2headings = headings.filter(h => h.level === 2)
  const isLarge = h2headings.length > 20

  return (
    <div className="sticky top-6 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 3rem)' }}>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-2 shrink-0">
        On this page
        {isLarge && (
          <span className="ml-1.5 text-slate-300 normal-case tracking-normal">
            ({h2headings.length})
          </span>
        )}
      </div>
      <nav
        ref={tocRef}
        className="flex-1 min-h-0 overflow-y-auto space-y-px overscroll-contain"
      >
        {h2headings.map(heading => {
          const isActive = activeId === heading.id
          const num = getSectionNum(heading.text)
          const display = isLarge ? getDisplayText(heading.text) : heading.text

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`
                flex items-baseline gap-1 px-2 rounded transition-all
                ${isLarge ? 'text-[11px] py-1' : 'text-xs py-1.5'}
                ${isActive
                  ? 'text-sky-700 font-medium bg-sky-50 border-l-2 border-sky-500 pl-1.5'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
              onClick={e => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                setActiveId(heading.id)
              }}
            >
              {num && (
                <span className={`font-semibold shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-300'}`}>
                  {num}
                </span>
              )}
              <span>{display}</span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}
