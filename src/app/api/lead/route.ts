/**
 * Captação de leads — POST /api/lead
 *
 * Recebe os dados do formulário, valida com Zod e encaminha o lead para o
 * destino configurado em LEAD_WEBHOOK_URL (hoje: Google Apps Script → planilha;
 * amanhã: n8n / Supabase / CRM — basta trocar a URL, sem mexer no front).
 *
 * Setup:
 *   LEAD_WEBHOOK_URL = URL do Web App do Google Apps Script (ou n8n/CRM)
 *   Sem a env, a rota responde 202 (aceito) e apenas loga — não quebra a UX.
 */

import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { Lead, LeadApiResponse } from '@/types/lead'

export const runtime = 'nodejs'

const LEAD_WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(40),
  email: z.string().trim().email().max(160).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  assunto: z.string().trim().max(120).optional(),
  intent: z.string().trim().max(40).optional(),
  source: z.string().trim().max(40).optional(),
  pageUrl: z.string().trim().max(500).optional(),
  propertySlug: z.string().trim().max(200).optional(),
  propertyTitle: z.string().trim().max(300).optional(),
  utm: z.record(z.string()).optional(),
  // honeypot anti-spam — deve chegar vazio
  website: z.string().max(0).optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido' } satisfies LeadApiResponse, { status: 400 })
  }

  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Dados inválidos' } satisfies LeadApiResponse, { status: 400 })
  }

  // Bot preencheu o honeypot → finge sucesso e descarta
  if (parsed.data.website) {
    return NextResponse.json({ success: true } satisfies LeadApiResponse)
  }

  const d = parsed.data
  const lead: Lead = {
    name: d.name,
    phone: d.phone,
    email: d.email || undefined,
    message: d.message || undefined,
    source: (d.source as Lead['source']) || 'outros',
    intent: d.intent as Lead['intent'] | undefined,
    status: 'novo',
    pageUrl: d.pageUrl,
    propertySlug: d.propertySlug,
    propertyTitle: d.propertyTitle,
    utm: d.utm,
    createdAt: new Date().toISOString(),
    notes: d.assunto ? `Assunto: ${d.assunto}` : undefined,
  }

  if (!LEAD_WEBHOOK_URL) {
    console.warn('[lead] LEAD_WEBHOOK_URL não configurada — lead recebido mas não persistido:', lead.name, lead.phone)
    return NextResponse.json({ success: true, message: 'sem-destino' } satisfies LeadApiResponse, { status: 202 })
  }

  try {
    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (!res.ok) throw new Error(`webhook respondeu ${res.status}`)
  } catch (err) {
    console.error('[lead] falha ao encaminhar lead para o destino:', err)
    return NextResponse.json({ success: false, error: 'Falha ao registrar o lead' } satisfies LeadApiResponse, { status: 502 })
  }

  return NextResponse.json({ success: true } satisfies LeadApiResponse)
}
