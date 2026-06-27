import { sanityFetch, sanityFetchArray } from '@/services/sanity'
import type { BlogPost } from '../types'
import { BLOG_LISTING_QUERY, BLOG_POST_QUERY, BLOG_SLUGS_QUERY } from './queries'

export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanityFetchArray<BlogPost>(BLOG_LISTING_QUERY, {}, { revalidate: 3600, tags: ['post'] })
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost>(BLOG_POST_QUERY, { slug }, { revalidate: 3600, tags: [`post:${slug}`] })
}

export async function getBlogSlugs(): Promise<Array<{ slug: string }>> {
  return sanityFetchArray(BLOG_SLUGS_QUERY, {}, { revalidate: 3600 })
}
