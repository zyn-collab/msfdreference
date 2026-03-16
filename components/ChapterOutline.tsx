'use client'

import { useState } from 'react'
import { List, ChevronDown, ChevronRight } from 'lucide-react'
import type { Heading } from '@/lib/types'

function getSectionNum(text: string): string | null {
  const m = text.match(/^(\d+\.\d+)\s/)
  return m ? m[1] : null
}

function getDisplayText(text: string): string {
  return text.replace(/^\d+\.\d+\s+/, '')
}

export default function ChapterOutline({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false)
  const h2s = headings.filter(h => h.level === 2)

  if (h2s.length < 15) return null

  return (
    <div className="chapter-outline mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer px-5 py-3.5 flex items-center gap-2.5 text-left"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <List size={16} className="text-slate-400 shrink-0" />
        <span className="flex-1 text-[1.05rem] font-semibold text-slate-600">
          Chapter Contents
        </span>
        <span className="text-xs text-slate-400 mr-1">{h2s.length} sections</span>
        {open
          ? <ChevronDown size={14} className="text-slate-400" />
          : <ChevronRight size={14} className="text-slate-400" />
        }
      </button>

      {open && (
        <div className="outline-body">
          {h2s.map(heading => {
            const num = getSectionNum(heading.text)
            const display = getDisplayText(heading.text)
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className="outline-item"
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {num && <span className="outline-num">{num}</span>}
                {display}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
