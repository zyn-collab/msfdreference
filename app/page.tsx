import { getAllChapters } from '@/lib/content'
import { redirect } from 'next/navigation'

export default function Home() {
  // Land directly on Part I — skip the table of contents file
  redirect('/01_Historical_Evolution')
}
