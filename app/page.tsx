import { getAllChapters } from '@/lib/content'
import { CATEGORY_LABELS } from '@/lib/types'
import EncyclopediaShell from '@/components/EncyclopediaShell'
import Link from 'next/link'
import { BookOpen, FileText, BarChart3, Building2, Scale, Newspaper } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  core: <BookOpen size={18} />,
  summary: <FileText size={18} />,
  workplans: <FileText size={18} />,
  evidence: <BarChart3 size={18} />,
  institutional: <Building2 size={18} />,
  obligations: <Scale size={18} />,
  news: <Newspaper size={18} />,
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  core: 'Parts I–XV covering history, law, institutions, and ten substantive policy domains.',
  summary: 'Condensed briefing decks for Ministry staff across child protection, gender, disability, and elderly care.',
  workplans: 'Action plan analysis, ministry projects, development partner programmes, and annual workplans.',
  evidence: 'Literature review, statistics compendium, and source tracking across all domains.',
  institutional: 'Service directories, CSO listings, legislation timelines, contact lists, and the glossary.',
  obligations: 'Mapping of Maldivian social policy to CRC, CEDAW, and CRPD treaty obligations.',
  news: 'Indexed Dhivehi-language news coverage from archive.mv across policy domains.',
}

export default function Home() {
  const allChapters = getAllChapters()

  // Group chapters by category
  const grouped = allChapters.reduce((acc, ch) => {
    if (!acc[ch.category]) acc[ch.category] = []
    acc[ch.category].push(ch)
    return acc
  }, {} as Record<string, typeof allChapters>)

  const categoryOrder = ['core', 'summary', 'workplans', 'evidence', 'institutional', 'obligations', 'news']

  return (
    <EncyclopediaShell chapters={allChapters}>
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:pl-10 lg:pr-10 py-0">

        {/* Hero */}
        <div className="pt-10 lg:pt-16 pb-10 max-w-[720px]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Ministry of Social and Family Development
          </div>
          <h1
            className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold text-slate-900 leading-tight tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            MSFD Knowledge Repository
          </h1>
          <p className="text-[12px] leading-relaxed text-slate-500 max-w-[620px]">
            This repository is a centralized, searchable collection of information, documentation, research, reviews, and reference materials relevant to social policy in the Maldives. It compiles knowledge relevant to social policy from government publications, international assessments, academic literature, policy timelines, literature reviews, news archives, contact directories, service provider maps, workplans, and other resources that would otherwise remain scattered across agencies, servers, and institutions. It is updated on an ongoing basis as new materials are produced and more documents are incorporated.
          </p>
          <p className="text-[12px] leading-relaxed text-slate-500 max-w-[620px] mt-3">
            The purpose of MSFD Knowledge Repository is to ensure that the collective knowledge produced across the social sector is preserved, organized, and easily accessible. This will ensure that new research, policy development, and program design can easily keep track of the field to support evidence-based policymaking, reduce time spent on information-gathering, learn from the successes or mistakes of past programs, and update with Ministry&apos;s ongoing work to preserve institutional knowledge in a permanent place safe for the long-term even through staff turnover, administrative changes, etc. It is also a reference for new staff to use, making it easy for new employees to immediately be fully up-to-speed on the sector and Ministry activities.
          </p>
        </div>

        {/* Category sections */}
        <div className="pb-16 max-w-[720px] space-y-8">
          {categoryOrder.map(cat => {
            const chapters = grouped[cat]
            if (!chapters?.length) return null
            const label = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]
            const desc = CATEGORY_DESCRIPTIONS[cat]
            const icon = CATEGORY_ICONS[cat]

            return (
              <div key={cat} className="border border-slate-100 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-0.5 text-slate-400">{icon}</div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">{label}</h2>
                    {desc && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>}
                  </div>
                </div>
                <div className="ml-[30px] flex flex-col gap-0.5">
                  {chapters.map(ch => {
                    const short = ch.title
                      .replace(/^PART\s+[IVXLC]+:\s*/i, '')
                      .replace(/^Summary:\s*/i, '')
                    return (
                      <Link
                        key={ch.slug}
                        href={`/${ch.slug}`}
                        className="text-[13px] text-slate-600 hover:text-sky-700 hover:bg-slate-50 rounded-md px-2 py-1.5 -mx-2 transition-colors leading-snug"
                      >
                        {short}
                      </Link>
                    )
                  })}
                  {cat === 'evidence' && (
                    <Link
                      href="/charts"
                      className="text-[13px] text-slate-600 hover:text-sky-700 hover:bg-slate-50 rounded-md px-2 py-1.5 -mx-2 transition-colors leading-snug"
                    >
                      Graphs &amp; Charts Library
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </EncyclopediaShell>
  )
}
