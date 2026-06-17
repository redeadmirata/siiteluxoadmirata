'use client'

/**
 * Sanity Studio embutido em /studio
 * Client component — Sanity usa React.createContext internamente.
 * Metadata e viewport ficam no layout.tsx (server component).
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
