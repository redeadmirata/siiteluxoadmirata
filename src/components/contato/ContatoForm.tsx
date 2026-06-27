'use client'

import { useState } from 'react'

const ASSUNTOS = [
  'Quero comprar um imóvel',
  'Quero vender um imóvel',
  'Quero alugar um imóvel',
  'Interesse em lançamento',
  'Assessoria de investimento',
  'Outro',
]

export default function ContatoForm() {
  const [fields, setFields] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
    website: '', // honeypot anti-spam (não exibido)
  })
  const [enviado, setEnviado] = useState(false)

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const { nome, email, telefone, assunto, mensagem, website } = fields

    // Captura o lead (fire-and-forget; keepalive garante o envio mesmo abrindo o WhatsApp)
    try {
      const params = new URLSearchParams(window.location.search)
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          name: nome,
          phone: telefone,
          email,
          message: mensagem,
          assunto,
          source: 'contato',
          pageUrl: window.location.href,
          website,
          utm: {
            ...(params.get('utm_source') && { source: params.get('utm_source') }),
            ...(params.get('utm_medium') && { medium: params.get('utm_medium') }),
            ...(params.get('utm_campaign') && { campaign: params.get('utm_campaign') }),
          },
        }),
      }).catch(() => {})
    } catch {
      /* não bloqueia o fluxo do WhatsApp */
    }

    const texto = [
      `Olá! Entrei em contato pelo site da Admirata.`,
      `*Nome:* ${nome}`,
      email ? `*E-mail:* ${email}` : '',
      telefone ? `*Telefone:* ${telefone}` : '',
      assunto ? `*Assunto:* ${assunto}` : '',
      mensagem ? `*Mensagem:* ${mensagem}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    window.open(
      `https://wa.me/5521998079459?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-stone bg-stone/20 p-8 text-center">
        <p className="text-lg font-semibold text-ink mb-2">Mensagem enviada!</p>
        <p className="text-muted text-sm">
          Você será redirecionado ao WhatsApp. Nossa equipe retorna em breve.
        </p>
        <button
          onClick={() => setEnviado(false)}
          className="mt-5 text-xs text-gold hover:underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Honeypot anti-spam — invisível para humanos */}
      <input
        type="text"
        name="website"
        value={fields.website}
        onChange={handle}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nome" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
            Nome *
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={fields.nome}
            onChange={handle}
            placeholder="Seu nome completo"
            className="w-full px-4 py-3 rounded-xl border border-stone bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors text-sm"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
            Telefone / WhatsApp *
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
            value={fields.telefone}
            onChange={handle}
            placeholder="(21) 9 0000-0000"
            className="w-full px-4 py-3 rounded-xl border border-stone bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handle}
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded-xl border border-stone bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors text-sm"
        />
      </div>

      <div>
        <label htmlFor="assunto" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
          Assunto
        </label>
        <select
          id="assunto"
          name="assunto"
          value={fields.assunto}
          onChange={handle}
          className="w-full px-4 py-3 rounded-xl border border-stone bg-white text-ink focus:outline-none focus:border-gold transition-colors text-sm appearance-none"
        >
          <option value="">Selecione o assunto</option>
          {ASSUNTOS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-xs uppercase tracking-wider text-muted mb-1.5">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          value={fields.mensagem}
          onChange={handle}
          placeholder="Descreva sua necessidade ou o imóvel de interesse..."
          className="w-full px-4 py-3 rounded-xl border border-stone bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-gold text-white font-semibold tracking-wide hover:bg-gold/90 transition-colors"
      >
        Enviar via WhatsApp
      </button>

      <p className="text-[11px] text-muted text-center">
        Ao enviar, você concorda com nossa{' '}
        <a href="/politica-de-privacidade" className="underline hover:text-ink">
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  )
}
