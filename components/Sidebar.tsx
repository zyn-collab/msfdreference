'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  BookOpen, Search, ChevronDown, ChevronRight, FileText,
  BarChart3, Globe, Newspaper, ClipboardList, Library,
  Building2, BookMarked,
} from 'lucide-react'
import type { Chapter, Category } from '@/lib/types'
import { getShortTitle } from '@/lib/types'

interface SidebarProps {
  chapters: Chapter[]
  onSearchOpen: () => void
}

interface NavGroup {
  label: string
  icon: React.ReactNode
  category: Category
  items: Chapter[]
}

const GROUP_CONFIG: { category: Category; label: string; icon: React.ReactNode }[] = [
  { category: 'core', label: 'Encyclopedia', icon: <BookOpen size={14} /> },
  { category: 'summary', label: 'Sector Trainings', icon: <BookMarked size={14} /> },
  { category: 'workplans', label: 'Projects, Programs & Workplans', icon: <ClipboardList size={14} /> },
  { category: 'evidence', label: 'Literature, Stats & Evidence Base', icon: <BarChart3 size={14} /> },
  { category: 'institutional', label: 'Institutional Knowledge', icon: <Building2 size={14} /> },
  { category: 'templates', label: 'Templates', icon: <FileText size={14} /> },
  { category: 'obligations', label: 'International Obligations', icon: <Globe size={14} /> },
  { category: 'news', label: 'News Archives', icon: <Newspaper size={14} /> },
]

function buildGroups(chapters: Chapter[]): NavGroup[] {
  return GROUP_CONFIG
    .map(cfg => ({
      ...cfg,
      items: chapters.filter(c => c.category === cfg.category),
    }))
    .filter(g => g.items.length > 0)
}

// Chapter number for core chapters in sidebar
function getChapterNum(chapter: Chapter): string | null {
  if (chapter.category !== 'core') return null
  const num = parseInt(chapter.filename)
  if (!isNaN(num) && num >= 1 && num <= 15) return `${num}.`
  return null
}

// Special non-markdown pages that belong in a category group
const EXTRA_GROUP_LINKS: Partial<Record<Category, { slug: string; title: string; external?: boolean }[]>> = {
  evidence: [
    { slug: 'charts', title: 'Graphs & Charts Library' },
    { slug: 'https://msfd-repository.vercel.app/', title: 'Publications Library', external: true },
  ],
}

function NavGroupComponent({ group, currentSlug }: { group: NavGroup; currentSlug: string }) {
  const extraLinks = EXTRA_GROUP_LINKS[group.category] ?? []
  const hasActive = group.items.some(c => c.slug === currentSlug) || extraLinks.some(l => l.slug === currentSlug)
  const [open, setOpen] = useState(hasActive)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
      >
        <span className="text-slate-400">{group.icon}</span>
        <span className="flex-1 text-left">{group.label}</span>
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      </button>

      {open && (
        <ul className="mt-0.5 space-y-0.5">
          {group.items.map(chapter => {
            const isActive = chapter.slug === currentSlug
            const shortTitle = getShortTitle(chapter.title)
            const num = getChapterNum(chapter)
            return (
              <li key={chapter.slug}>
                <Link
                  href={`/${chapter.slug}`}
                  className={`
                    flex items-start gap-2 px-3 py-2 rounded-md text-[13px] leading-snug transition-all
                    ${isActive
                      ? 'bg-sky-50 text-sky-700 font-medium border-l-2 border-sky-600 pl-[10px]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  {num ? (
                    <span className={`text-xs font-semibold mt-0.5 shrink-0 w-5 ${isActive ? 'text-sky-500' : 'text-slate-300'}`}>
                      {num}
                    </span>
                  ) : (
                    <FileText size={13} className={`mt-0.5 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-300'}`} />
                  )}
                  <span>{shortTitle}</span>
                </Link>
              </li>
            )
          })}
          {extraLinks.map(link => {
            const isActive = link.slug === currentSlug
            if (link.external) {
              return (
                <li key={link.slug}>
                  <a
                    href={link.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 px-3 py-2 rounded-md text-[13px] leading-snug transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Library size={13} className="mt-0.5 shrink-0 text-slate-300" />
                    <span className="flex-1">{link.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 opacity-30 shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </li>
              )
            }
            return (
              <li key={link.slug}>
                <Link
                  href={`/${link.slug}`}
                  className={`
                    flex items-start gap-2 px-3 py-2 rounded-md text-[13px] leading-snug transition-all
                    ${isActive
                      ? 'bg-sky-50 text-sky-700 font-medium border-l-2 border-sky-600 pl-[10px]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <BarChart3 size={13} className={`mt-0.5 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-300'}`} />
                  <span>{link.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function Sidebar({ chapters, onSearchOpen }: SidebarProps) {
  const pathname = usePathname()
  const currentSlug = pathname.replace(/^\//, '')
  const groups = buildGroups(chapters)

  return (
    <aside className="w-80 shrink-0 bg-[#f8fafc] border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/" className="block group">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-sky-700 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                KnowHow
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 leading-tight pl-[38px]">
            Ministry of Social &amp; Family Development
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-slate-100">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 hover:border-sky-300 hover:text-slate-600 transition-all shadow-sm"
        >
          <Search size={13} />
          <span className="flex-1 text-left text-xs">Search encyclopedia…</span>
          <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {groups.map(group => (
          <NavGroupComponent key={group.category} group={group} currentSlug={currentSlug} />
        ))}

      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div className="text-[10px] text-slate-400 space-y-0.5">
          <div className="font-medium text-slate-500">
            {chapters.length} chapters
          </div>
          <div>© {new Date().getFullYear()} MoSFD · Maldives</div>
        </div>
      </div>
    </aside>
  )
}
