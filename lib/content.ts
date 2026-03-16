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

  // International obligations
  if (['CRPD_Obligations', 'CRC_Obligations', 'CEDAW_Obligations'].includes(name)) return 'obligations'

  // Ministry workplans
  if (['Action_Plans_Analysis'].includes(name)) return 'workplans'

  // Literature, Stats & Evidence Base
  if (['Literature_Review', 'Statistics_Compendium', 'Source_Tracking_Table'].includes(name)) return 'evidence'

  // Institutional Knowledge
  if ([
    'Service_Referral_Guide', 'CSO_NGO_Directory', 'Development_Partner_Projects',
    'Service_Providers_by_Island', 'Full_Contact_List', 'Expert_Roster',
    'Key_Institutions_Directory', 'Legislation_Timeline', 'Glossary',
  ].includes(name)) return 'institutional'

  // Core chapters: numbered 01-15 + Development Partners
  const num = parseInt(filename)
  if (!isNaN(num) && num >= 1 && num <= 15) return 'core'
  if (name === 'Development_Partners') return 'core'

  // Fallback
  return 'institutional'
}

// ── Sort order ──────────────────────────────────────────
// Groups are ordered: core → summary → workplans → evidence → institutional → obligations → news
const GROUP_ORDER: Record<Category, number> = {
  core: 0,
  summary: 1,
  workplans: 2,
  evidence: 3,
  institutional: 4,
  obligations: 5,
  news: 6,
}

// Within-group sort: known filenames get explicit order, rest alphabetical
const EXPLICIT_ORDER: Record<string, number> = {
  // Core chapters by number
  '01_Historical_Evolution': 1,
  '02_Legal_Framework': 2,
  '03_Institutional_Architecture': 3,
  '04_Child_Protection': 4,
  '05_Gender_GBV_Women': 5,
  '06_Disability': 6,
  '07_Elderly_Ageing': 7,
  '08_Substance_Abuse': 8,
  '09_Mental_Health': 9,
  '10_Education_Youth': 10,
  '11_Health_Systems': 11,
  '12_Housing_Poverty': 12,
  '13_Social_Protection': 13,
  '14_Climate_Vulnerability': 14,
  '15_Cross_Cutting_Issues': 15,
  'Development_Partners': 16,
  // Summaries follow their parent chapter order
  'Summary_Child_Protection': 1,
  'Summary_Gender': 2,
  'Summary_Disability': 3,
  'Summary_Elderly': 4,
  // Evidence
  'Literature_Review': 1,
  'Statistics_Compendium': 2,
  'Source_Tracking_Table': 3,
  // Institutional
  'Service_Referral_Guide': 1,
  'Service_Providers_by_Island': 2,
  'CSO_NGO_Directory': 3,
  'Development_Partner_Projects': 4,
  'Full_Contact_List': 5,
  'Key_Institutions_Directory': 6,
  'Legislation_Timeline': 7,
  'Glossary': 8,
  'Expert_Roster': 9,
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
      const sectionText = lines.slice(1).join(' ').replace(/[#*_`[\]]/g, '').trim()
      const excerpt = sectionText.slice(0, 200).trim()
      const sectionId = sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      items.push({
        slug: chapter.slug,
        chapterTitle: chapter.title,
        sectionTitle,
        sectionId,
        excerpt,
      })
    }
  }

  return items
}
