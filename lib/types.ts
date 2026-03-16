// Shared types and pure utilities — safe to import from client components

export type Category =
  | 'core'
  | 'summary'
  | 'workplans'
  | 'evidence'
  | 'institutional'
  | 'obligations'
  | 'news'

export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

export interface Chapter {
  slug: string
  filename: string
  title: string
  category: Category
  sortOrder: number
}

export interface ChapterContent extends Chapter {
  html: string
  headings: Heading[]
  wordCount: number
  prevChapter: Chapter | null
  nextChapter: Chapter | null
}

export interface SearchItem {
  slug: string
  chapterTitle: string
  sectionTitle: string
  sectionId: string
  excerpt: string
}

// Words that stay lowercase in title case (articles, prepositions, conjunctions)
const LOWER_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in',
  'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet',
])

function smartTitleCase(str: string): string {
  const letters = str.replace(/[^a-zA-Z]/g, '')
  // Only convert if the string is entirely uppercase
  if (letters.length === 0 || letters !== letters.toUpperCase()) return str
  return str.split(' ').map((word, i) => {
    const lower = word.toLowerCase()
    // Keep lowercase words lowercase unless they start the title
    if (i > 0 && LOWER_WORDS.has(lower)) return lower
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }).join(' ')
}

// Short display name used in sidebar and prev/next links
export function getShortTitle(title: string): string {
  const stripped = title
    .replace(/^PART\s+[IVXLC]+:\s*/i, '')
    .replace(/^APPENDIX\s+[A-Z][^:]*[:\s–—-]+/i, '')
    .replace(/^Summary:\s*/i, '')
  return smartTitleCase(stripped)
}

// Returns "Part I", "Part IV", etc. — null for non-core chapters
export function getPartLabel(title: string): string | null {
  const match = title.match(/^PART\s+([IVXLC]+)/i)
  if (!match) return null
  return `Part ${match[1].toUpperCase()}`
}

// Category display labels for the chapter page header
export const CATEGORY_LABELS: Record<Category, string> = {
  core: 'Encyclopedia',
  summary: 'Summary',
  workplans: 'Ministry Workplans',
  evidence: 'Literature, Stats & Evidence Base',
  institutional: 'Institutional Knowledge',
  obligations: 'International Obligations',
  news: 'News Archive',
}
