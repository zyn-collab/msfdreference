import { Suspense } from 'react'
import { getAllChapters } from '@/lib/content'
import EncyclopediaShell from '@/components/EncyclopediaShell'
import SearchResults from './SearchResults'

export default function SearchPage() {
  const chapters = getAllChapters()

  return (
    <EncyclopediaShell chapters={chapters}>
      <div className="flex-1 min-w-0">
        <Suspense fallback={<div className="px-6 py-12 text-sm text-slate-400">Loading…</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </EncyclopediaShell>
  )
}
