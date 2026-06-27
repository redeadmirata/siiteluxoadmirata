/**
 * Webhook de revalidação — Sanity → Next.js
 *
 * Sanity chama este endpoint via GROQ-powered Webhook quando um documento
 * é publicado/atualizado. Revalida apenas as cache tags afetadas.
 *
 * Setup no Sanity Studio:
 *   URL:     https://admirata.com.br/api/revalidate
 *   Secret:  SANITY_REVALIDATE_SECRET
 *   Method:  POST
 *   Trigger: "On Publish"
 *   GROQ filter: _type in ["imovel","condominio","bairro","post","lancamento"]
 */

import { revalidateTag, revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET

function authorize(req: NextRequest): NextResponse | null {
  if (!REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Revalidation is not configured' },
      { status: 503 },
    )
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (token !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

/** Mapeia tipos de documento Sanity → cache tags a revalidar */
function getTagsForType(type: string, slug?: string): string[] {
  switch (type) {
    case 'imovel':
      return slug ? ['imovel', `imovel:${slug}`] : ['imovel']
    case 'condominio':
      return slug ? ['condominio', `condominio:${slug}`] : ['condominio']
    case 'bairro':
      return slug ? ['bairro', `bairro:${slug}`] : ['bairro']
    case 'post':
    case 'artigo':
      return slug ? ['blog', `blog:${slug}`] : ['blog']
    case 'lancamento':
      return slug ? ['lancamento', `lancamento:${slug}`] : ['lancamento']
    case 'siteSettings':
    case 'configuracao':
      return ['home']
    default:
      return []
  }
}

/** POST — Sanity webhook com assinatura */
export async function POST(req: NextRequest) {
  const authError = authorize(req)
  if (authError) return authError

  try {
    const body = await req.json() as { _type?: string; slug?: { current?: string } }

    if (!body._type) {
      return NextResponse.json({ error: 'Missing _type' }, { status: 400 })
    }

    const slug = body.slug?.current
    const tags = getTagsForType(body._type, slug)
    if (tags.length === 0) {
      return NextResponse.json({ error: 'Unsupported _type' }, { status: 400 })
    }
    tags.forEach((tag) => revalidateTag(tag))

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      slug,
      tags,
      ts: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/** GET — revalidação manual por tag/path (útil em dev e triggers manuais) */
export async function GET(req: NextRequest) {
  const authError = authorize(req)
  if (authError) return authError

  const tag = req.nextUrl.searchParams.get('tag')
  const path = req.nextUrl.searchParams.get('path')

  if (tag) {
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, tag })
  }

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  }

  // Revalidação global (fallback)
  const allTags = ['imovel', 'condominio', 'bairro', 'blog', 'lancamento', 'home']
  allTags.forEach((t) => revalidateTag(t))
  return NextResponse.json({ revalidated: true, tags: allTags })
}
