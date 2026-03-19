import 'server-only'
import fs from 'fs'
import path from 'path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import type { Chapter, ChapterContent, SearchItem, Heading, Category } from './types'

// Re-export types and pure utilities for server components
export type { Chapter, ChapterContent, SearchItem, Heading, Category }
export { getShortTitle, getPartLabel, CATEGORY_LABELS } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Pre-build the markdown processor once (reused across all chapters)
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeStringify)

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '')
}

// ── Category assignment ─────────────────────────────────
function getCategory(filename: string): Category {
  const name = filename.replace(/\.md$/, '')

  // Summaries
  if (name.startsWith('Summary_')) return 'summary'

  // News archives
  if (name.startsWith('News_Archive_')) return 'news'

  // Templates
  if (name.startsWith('Template_')) return 'templates'

  // International obligations
  if (['CRPD_Obligations', 'CRC_Obligations', 'CEDAW_Obligations'].includes(name)) return 'obligations'

  // Projects, programs & workplans
  if (['Action_Plans_Analysis', 'Ministry_Projects_2025_2028', 'Workplan_2026', 'Development_Partner_Projects'].includes(name)) return 'workplans'

  // Literature, Stats & Evidence Base
  if (['Literature_Review', 'Statistics_Compendium', 'Source_Tracking_Table'].includes(name)) return 'evidence'

  // Institutional Knowledge
  if ([
  'Social_Sector_Capacity_Assessment': 1,
  'Internal_Datasets': 2,
  'Service_Referral_Guide': 3,
  'Service_Providers_by_Island': 4,
  'CSO_NGO_Directory': 5,
  'Full_Contact_List': 6,
  'Key_Institutions_Directory': 7,
  'Legislation_Timeline': 8,
  'Glossary': 9,
  'Expert_Roster': 10,
  // Templates
  'Template_Cabinet_Social_Council_Paper': 1,
  'Template_Concept_Note': 2,
  'Template_SOP': 3,
  'Template_Email': 4,
  'Template_Social_Media': 5,
  'Template_Research_Paper': 6,
  // Obligations
  'CRC_Obligations': 1,
  'CEDAW_Obligations': 2,
  'CRPD_Obligations': 3,
}

function getSortKey(filename: string): [number, number] {
  const name = filename.replace(/\.md$/, '')
  const cat = getCategory(filename)
  const groupOrder = GROUP_ORDER[cat]
  const withinOrder = EXPLICIT_ORDER[name] ?? 99
  return [groupOrder, withinOrder]
}

// ── Title handling ──────────────────────────────────────
const SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in',
  'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet',
])

function normalizeTitleCase(title: string): string {
  const letters = title.replace(/[^a-zA-Z]/g, '')
  if (letters.length === 0 || letters !== letters.toUpperCase()) return title
  return title.split(': ').map(segment =>
    segment.split(' ').map((word, i) => {
      const lower = word.toLowerCase()
      if (/^[ivxlc]+$/i.test(word) && word.length <= 6) return word.toUpperCase()
      if (i > 0 && SMALL_WORDS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    }).join(' ')
  ).join(': ')
}

function extractTitle(content: string, filename: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return normalizeTitleCase(match[1].trim())
  return filename.replace(/^\d+[a-z]?_/, '').replace(/_/g, ' ').replace(/\.md$/, '')
}

// ── Data layer ──────────────────────────────────────────
let chaptersCache: Chapter[] | null = null
const contentCache = new Map<string, ChapterContent>()

export function getAllChapters(): Chapter[] {
  if (chaptersCache) return chaptersCache

  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => f !== '00_Table_of_Contents.md')
    .sort((a, b) => {
      const [ag, ao] = getSortKey(a)
      const [bg, bo] = getSortKey(b)
      if (ag !== bg) return ag - bg
      return ao - bo
    })

  chaptersCache = files.map((filename, index) => {
    const filepath = path.join(CONTENT_DIR, filename)
    const raw = fs.readFileSync(filepath, 'utf-8')
    const title = extractTitle(raw, filename)
    return {
      slug: filenameToSlug(filename),
      filename,
      title,
      category: getCategory(filename),
      sortOrder: index,
    }
  })

  return chaptersCache
}

export async function getChapterBySlug(slug: string): Promise<ChapterContent | null> {
  if (contentCache.has(slug)) return contentCache.get(slug)!

  const chapters = getAllChapters()
  const index = chapters.findIndex(c => c.slug === slug)
  if (index === -1) return null

  const chapter = chapters[index]
  const filepath = path.join(CONTENT_DIR, chapter.filename)
  let raw = fs.readFileSync(filepath, 'utf-8')

  // Strip the first H1 (we display chapter title separately in the header)
  raw = raw.replace(/^#\s+.+\n(\n---\n)?/, '')

  const wordCount = raw.split(/\s+/).filter(Boolean).length

  const result = await processor.process(raw)

  const html = String(result)
  const headings = extractHeadingsFromHtml(html)

  const content: ChapterContent = {
    ...chapter,
    html,
    headings,
    wordCount,
    prevChapter: index > 0 ? chapters[index - 1] : null,
    nextChapter: index < chapters.length - 1 ? chapters[index + 1] : null,
  }

  contentCache.set(slug, content)
  return content
}

function extractHeadingsFromHtml(html: string): Heading[] {
  const headings: Heading[] = []
  const pattern = /<h([23])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/g
  let match
  while ((match = pattern.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]) as 2 | 3,
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').trim(),
    })
  }
  return headings
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const chapters = getAllChapters()
  const items: SearchItem[] = []

  for (const chapter of chapters) {
    const filepath = path.join(CONTENT_DIR, chapter.filename)
    const raw = fs.readFileSync(filepath, 'utf-8')

    const sections = raw.split(/^## /m)
    for (const section of sections.slice(1)) {
      const lines = section.split('\n')
      const sectionTitle = lines[0].trim()
      // fullText preserves paragraph breaks for context-aware excerpts
      const sectionRaw = lines.slice(1).join('\n').replace(/[#*_`[\]]/g, '')
      const sectionText = sectionRaw.replace(/\n{2,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim()
      const excerpt = sectionText.replace(/\n+/g, ' ').slice(0, 200).trim()
      const sectionId = sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      items.push({
        slug: chapter.slug,
        chapterTitle: chapter.title,
        sectionTitle,
        sectionId,
        excerpt,
        fullText: sectionText,
      })
    }
  }

  return items
}
