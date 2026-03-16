import { getAllChapters, getChapterBySlug, getShortTitle } from '@/lib/content'
import { getPartLabel, CATEGORY_LABELS } from '@/lib/types'
import { notFound } from 'next/navigation'
import EncyclopediaShell from '@/components/EncyclopediaShell'
import InPageTOC from '@/components/InPageTOC'
import ChapterOutline from '@/components/ChapterOutline'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

export async function generateStaticParams() {
  const chapters = getAllChapters()
  return chapters.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const chapter = await getChapterBySlug(slug)
  if (!chapter) return {}
  return {
    title: `${getShortTitle(chapter.title)} — MSFD Knowledge Repository`,
  }
}


export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [chapter, allChapters] = await Promise.all([
    getChapterBySlug(slug),
    Promise.resolve(getAllChapters()),
  ])

  if (!chapter) notFound()

  const readingMinutes = Math.ceil(chapter.wordCount / 200)
  const partLabel = getPartLabel(chapter.title)
  const shortTitle = getShortTitle(chapter.title)
  const sectionCount = chapter.headings.filter(h => h.level === 2).length

  return (
    <EncyclopediaShell chapters={allChapters}>
      <div className="flex min-h-full">

        {/* Reading column + content */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:pl-10 lg:pr-6 py-0">

          {/* Chapter header */}
          <div className="pt-6 lg:pt-10 pb-7 border-b border-slate-100 max-w-[700px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {CATEGORY_LABELS[chapter.category]}
              </span>
              {partLabel && (
                <>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
                    {partLabel}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[1.85rem] font-bold text-slate-900 leading-tight tracking-tight mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              {shortTitle}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                {readingMinutes} min read
              </span>
              <span>{chapter.wordCount.toLocaleString()} words</span>
              {sectionCount > 0 && <span>{sectionCount} sections</span>}
            </div>
          </div>

          {/* Article content */}
          <div className="pt-8 pb-16 max-w-[700px]">
            <ChapterOutline headings={chapter.headings} />
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: chapter.html }}
            />

            {/* Prev / Next */}
            <div className="mt-14 pt-7 border-t border-slate-100 flex items-start justify-between gap-4">
              {chapter.prevChapter ? (
                <Link
                  href={`/${chapter.prevChapter.slug}`}
                  className="group flex items-center gap-2.5 text-sm text-slate-500 hover:text-sky-700 transition-colors max-w-[240px]"
                >
                  <div className="shrink-0 w-7 h-7 rounded-lg border border-slate-200 group-hover:border-sky-300 flex items-center justify-center transition-colors">
                    <ChevronLeft size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Previous</div>
                    <div className="font-medium text-sm leading-snug group-hover:text-sky-700 line-clamp-2">
                      {getShortTitle(chapter.prevChapter.title)}
                    </div>
                  </div>
                </Link>
              ) : <div />}

              {chapter.nextChapter ? (
                <Link
                  href={`/${chapter.nextChapter.slug}`}
                  className="group flex items-center gap-2.5 text-sm text-slate-500 hover:text-sky-700 transition-colors max-w-[240px] text-right"
                >
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Next</div>
                    <div className="font-medium text-sm leading-snug group-hover:text-sky-700 line-clamp-2">
                      {getShortTitle(chapter.nextChapter.title)}
                    </div>
                  </div>
                  <div className="shrink-0 w-7 h-7 rounded-lg border border-slate-200 group-hover:border-sky-300 flex items-center justify-center transition-colors">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>

        {/* Right TOC column — sits outside the reading column */}
        <div className="w-96 shrink-0 pr-6 hidden xl:block overflow-hidden">
          <InPageTOC headings={chapter.headings} />
        </div>

      </div>
    </EncyclopediaShell>
  )
}
