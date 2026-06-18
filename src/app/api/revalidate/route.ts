import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
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

  // Revalidate all common tags by default
  revalidateTag('condominio')
  revalidateTag('bairro')
  revalidateTag('imovel')
  revalidatePath('/condominios', 'layout')

  return NextResponse.json({ revalidated: true, tags: ['condominio', 'bairro', 'imovel'] })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
