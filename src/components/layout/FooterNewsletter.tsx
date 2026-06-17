'use client'

import { useState, useRef } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function FooterNewsletter() {
  const [state, setState] = useState<State>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = inputRef.current?.value.trim() ?? ''
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return

    setState('loading')
    try {
      // TODO: substituir por integração real (Mailchimp / n8n webhook)
      await new Promise((r) => setTimeout(r, 800))
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="bg-ink border-b border-white/8">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Copy */}
          <div className="max-w-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
              Curadoria exclusiva
            </p>
            <h2 className="font-display text-2xl text-white leading-snug">
              Receba imóveis selecionados antes de todo mundo
            </h2>
          </div>

          {/* Formulário */}
          <div className="w-full max-w-md">
            {state === 'success' ? (
              <div className="flex items-center gap-3 py-4">
                <span className="text-gold text-xl leading-none" aria-hidden>✓</span>
                <p className="text-sm text-white/70 leading-snug">
                  Obrigado! Em breve você receberá nossas novidades exclusivas.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Inscrição na newsletter Admirata"
              >
                <div className="flex gap-0">
                  <input
                    ref={inputRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Seu melhor e-mail"
                    disabled={state === 'loading'}
                    className="
                      flex-1 min-w-0 bg-white/5 border border-white/15 border-r-0
                      text-sm text-white placeholder:text-white/30
                      px-4 py-3 outline-none
                      focus:border-gold/50 focus:bg-white/8
                      disabled:opacity-50
                      transition-colors duration-200
                    "
                    required
                  />
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="
                      shrink-0 bg-gold text-ink text-[11px] uppercase tracking-[0.22em]
                      px-6 py-3 font-medium
                      hover:bg-[#d4ac1a] active:bg-[#c09a15]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200
                    "
                  >
                    {state === 'loading' ? '...' : 'Assinar'}
                  </button>
                </div>

                {state === 'error' && (
                  <p className="mt-2 text-[11px] text-red-400">
                    Algo deu errado. Tente novamente.
                  </p>
                )}
                <p className="mt-2 text-[10px] text-white/30 leading-relaxed">
                  Sem spam. Apenas imóveis exclusivos e novidades do mercado de alto padrão.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
