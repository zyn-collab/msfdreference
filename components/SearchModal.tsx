'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, Hash, ExternalLink } from 'lucide-react'
import Fuse from 'fuse.js'
import type { SearchItem } from '@/lib/types'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

// Get the paragraph containing the search term
function getContextSnippet(item: SearchItem, term: string): string {
  if (!term || !item.fullText) return item.excerpt
  const termLower = term.toLowerCase()
  const paragraphs = item.fullText.split(/\n\n+/)
  for (const para of paragraphs) {
    if (para.toLowerCase().includes(termLower)) {
      return para.replace(/\n/g, ' ').trim()
    }
  }
  return item.excerpt
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [index, setIndex] = useState<Fuse<SearchItem> | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load search index on first open
  useEffect(() => {
    if (!open || index) return
    setLoading(true)
    fetch('/api/search-index')
      .then(r => r.json())
      .then((data: SearchItem[]) => {
        const fuse = new Fuse(data, {
          keys: [
            { name: 'sectionTitle', weight: 0.3 },
            { name: 'fullText', weight: 0.5 },
            { name: 'chapterTitle', weight: 0.2 },
          ],
          threshold: 0.3,
          minMatchCharLength: 2,
          includeScore: true,
        })
        setIndex(fuse)
        setLoading(false)
      })
  }, [open, index])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Search on query change
  useEffect(() => {
    if (!index || !query.trim()) {
      setResults([])
      return
    }
    const hits = index.search(query, { limit: 12 })
    setResults(hits.map(h => h.item))
    setSelectedIndex(0)
  }, [query, index])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      const r = results[selectedIndex]
      navigateTo(r)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [results, selectedIndex, onClose])

  function navigateTo(item: SearchItem) {
    onClose()
    router.push(`/${item.slug}#${item.sectionId}`)
  }

  function openFullResults() {
    onClose()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search chapters, sections, topics…"
            className="flex-1 text-base text-slate-900 placeholder-slate-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">Loading search index…</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && !query && (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              Type to search across all chapters
            </div>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((item, i) => (
                <li key={`${item.slug}-${item.sectionId}`}>
                  <button
                    onClick={() => navigateTo(item)}
                    className={`
                      w-full text-left px-4 py-3 transition-colors border-b border-slate-50 last:border-0
                      ${i === selectedIndex ? 'bg-sky-50' : 'hover:bg-slate-50'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {i === selectedIndex
                          ? <Hash size={14} className="text-sky-600" />
                          : <FileText size={14} className="text-slate-300" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-slate-400 mb-0.5 truncate">
                          {item.chapterTitle.replace(/^PART\s+[IVXLC]+:\s*/i, '')}
                        </div>
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {item.sectionTitle}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {getContextSnippet(item, query)}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-4 text-[10px] text-slate-400">
          <span><kbd className="bg-white border border-slate-200 rounded px-1 py-0.5 font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="bg-white border border-slate-200 rounded px-1 py-0.5 font-mono">↵</kbd> open</span>
          <span><kbd className="bg-white border border-slate-200 rounded px-1 py-0.5 font-mono">esc</kbd> close</span>
          {query && results.length > 0 && (
            <button
              onClick={openFullResults}
              className="ml-auto flex items-center gap-1 text-sky-600 hover:text-sky-800 transition-colors text-[11px] font-medium"
            >
              View all results <ExternalLink size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
