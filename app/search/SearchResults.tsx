'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Copy, Check, FileText } from 'lucide-react'
import type { SearchItem } from '@/lib/types'

function highlightTerm(text: string, term: string): React.ReactNode[] {
  if (!term) return [text]
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-amber-200 text-amber-900 rounded-sm px-0.5">{part}</mark>
      : <span key={i}>{part}</span>
  )
}

function getContextExcerpt(fullText: string, term: string, radius: number = 120): string[] {
  if (!term || !fullText) return []
  const lower = fullText.toLowerCase()
  const termLower = term.toLowerCase()
  const excerpts: string[] = []
  let startFrom = 0

  while (startFrom < lower.length) {
    const idx = lower.indexOf(termLower, startFrom)
    if (idx === -1) break

    const start = Math.max(0, idx - radius)
    const end = Math.min(fullText.length, idx + term.length + radius)
    let snippet = fullText.slice(start, end).trim()
    if (start > 0) snippet = '…' + snippet
    if (end < fullText.length) snippet = snippet + '…'
    excerpts.push(snippet)
    startFrom = idx + term.length
  }

  return excerpts
}

interface MatchResult {
  item: SearchItem
  matchCount: number
  excerpts: string[]
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)
  const [searchIndex, setSearchIndex] = useState<SearchItem[] | null>(null)
  const [results, setResults] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeResult, setActiveResult] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRefs = useRef<(HTMLDivElement | null)[]>([])

  // Load index
  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then((data: SearchItem[]) => {
        setSearchIndex(data)
        setLoading(false)
      })
  }, [])

  // Perform search when index loads or query changes
  useEffect(() => {
    if (!searchIndex || !query.trim()) {
      setResults([])
      return
    }

    const termLower = query.toLowerCase()
    const matches: MatchResult[] = []

    for (const item of searchIndex) {
      const textToSearch = `${item.sectionTitle} ${item.fullText}`.toLowerCase()
      const count = textToSearch.split(termLower).length - 1
      if (count > 0) {
        const excerpts = getContextExcerpt(item.fullText, query)
        // Also check section title
        if (item.sectionTitle.toLowerCase().includes(termLower)) {
          excerpts.unshift(item.sectionTitle)
        }
        matches.push({ item, matchCount: count, excerpts: excerpts.slice(0, 5) })
      }
    }

    matches.sort((a, b) => b.matchCount - a.matchCount)
    setResults(matches)
    setActiveResult(0)
  }, [searchIndex, query])

  // Update URL when query changes
  useEffect(() => {
    if (query !== q) {
      const url = query ? `/search?q=${encodeURIComponent(query)}` : '/search'
      router.replace(url, { scroll: false })
    }
  }, [query])

  const totalMatches = results.reduce((sum, r) => sum + r.matchCount, 0)

  const navigateResult = useCallback((direction: 'prev' | 'next') => {
    setActiveResult(current => {
      const next = direction === 'next'
        ? Math.min(current + 1, results.length - 1)
        : Math.max(current - 1, 0)
      resultRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return next
    })
  }, [results.length])

  const copyAllResults = useCallback(() => {
    if (!results.length) return
    const text = results.map(r => {
      const chapter = r.item.chapterTitle.replace(/^PART\s+[IVXLC]+:\s*/i, '')
      const lines = [
        `[${chapter} > ${r.item.sectionTitle}]`,
        `Link: ${window.location.origin}/${r.item.slug}#${r.item.sectionId}`,
        '',
        ...r.excerpts.map(e => `  ${e}`),
        '',
      ]
      return lines.join('\n')
    }).join('\n---\n\n')

    const header = `Search results for "${query}" — ${totalMatches} mentions across ${results.length} sections\n\n`
    navigator.clipboard.writeText(header + text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [results, query, totalMatches])

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-4">
          <ArrowLeft size={12} /> Back to repository
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Search Results
        </h1>

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all chapters…"
            className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-sm text-slate-400">Loading search index…</div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-400">
          No results for &ldquo;{query}&rdquo;
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          {/* Summary bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{totalMatches}</span> mentions across{' '}
              <span className="font-semibold text-slate-700">{results.length}</span> sections
            </div>
            <div className="flex items-center gap-3">
              {/* Prev/Next navigation */}
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <button
                  onClick={() => navigateResult('prev')}
                  disabled={activeResult === 0}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="min-w-[3ch] text-center">{activeResult + 1}/{results.length}</span>
                <button
                  onClick={() => navigateResult('next')}
                  disabled={activeResult === results.length - 1}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              {/* Copy all */}
              <button
                onClick={copyAllResults}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-sky-700 border border-slate-200 rounded-md px-2 py-1 hover:border-sky-300 transition-colors"
              >
                {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy all results</>}
              </button>
            </div>
          </div>

          {/* Results list */}
          <div className="space-y-3">
            {results.map((r, i) => {
              const chapter = r.item.chapterTitle.replace(/^PART\s+[IVXLC]+:\s*/i, '')
              const isActive = i === activeResult
              return (
                <div
                  key={`${r.item.slug}-${r.item.sectionId}`}
                  ref={el => { resultRefs.current[i] = el }}
                  className={`border rounded-lg p-4 transition-all ${
                    isActive ? 'border-sky-300 bg-sky-50/30 shadow-sm' : 'border-slate-150 bg-white hover:border-slate-300'
                  }`}
                  onClick={() => setActiveResult(i)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1">
                        <FileText size={10} className="shrink-0" />
                        <span className="truncate">{chapter}</span>
                      </div>
                      <Link
                        href={`/${r.item.slug}#${r.item.sectionId}`}
                        className="text-sm font-semibold text-slate-800 hover:text-sky-700 transition-colors leading-snug"
                      >
                        {highlightTerm(r.item.sectionTitle, query)}
                      </Link>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 shrink-0">
                      {r.matchCount} {r.matchCount === 1 ? 'mention' : 'mentions'}
                    </span>
                  </div>

                  {/* Excerpts */}
                  <div className="space-y-1.5">
                    {r.excerpts.map((excerpt, j) => (
                      <div key={j} className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200">
                        {highlightTerm(excerpt, query)}
                      </div>
                    ))}
                  </div>

                  {/* Link */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <Link
                      href={`/${r.item.slug}#${r.item.sectionId}`}
                      className="text-[11px] text-sky-600 hover:text-sky-800 transition-colors"
                    >
                      Go to section →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
