'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import SearchModal from './SearchModal'
import type { Chapter } from '@/lib/types'
import { usePathname } from 'next/navigation'

export default function EncyclopediaShell({
  chapters,
  children,
}: {
  chapters: Chapter[]
  children: React.ReactNode
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <a href="/" className="text-sm font-semibold text-slate-700 hover:text-sky-700 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
          MSFD Knowledge Repository
        </a>
      </div>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg+, slide-in drawer on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-200 ease-out
        lg:relative lg:translate-x-0 lg:transition-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar chapters={chapters} onSearchOpen={openSearch} />
      </div>

      {/* Main content — add top padding on mobile for the header bar */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">{children}</main>
      <SearchModal open={searchOpen} onClose={closeSearch} />
    </div>
  )
}
