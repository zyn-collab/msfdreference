import { Metadata } from 'next'
import EncyclopediaShell from '@/components/EncyclopediaShell'
import { getAllChapters } from '@/lib/content'
import ChartsLibrary from './ChartsLibrary'

export const metadata: Metadata = {
  title: 'Graphs & Charts Library — MSFD Knowledge Repository',
}

export default function ChartsPage() {
  const allChapters = getAllChapters()

  return (
    <EncyclopediaShell chapters={allChapters}>
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:pl-10 lg:pr-10 py-0">
        <div className="pt-10 lg:pt-16 pb-6 max-w-[900px]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Evidence Base
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Graphs &amp; Charts Library
          </h1>
          <p className="text-xs leading-relaxed text-slate-400 max-w-[620px]">
            Ready-to-use visualizations drawn from the Statistics Compendium and encyclopedia chapters. Charts can be screenshotted and inserted directly into reports, presentations, or policy documents. Source references and data periods are included on each chart.
          </p>
          <p className="text-[10px] leading-relaxed text-slate-400 mt-2">
            Charts resize automatically to fit the browser window. To adjust chart size for screenshots, resize the browser window to the desired width.
          </p>
        </div>
        <ChartsLibrary />
      </div>
    </EncyclopediaShell>
  )
}
