/**
 * Hook para gerar URLs de WhatsApp com contexto e praça.
 */

'use client'

import { useCallback } from 'react'
import type { Praca, CTAContexto } from '../types'
import { WHATSAPP_NUMEROS, WHATSAPP_MENSAGENS } from '../constants'

interface UseWhatsAppOptions {
  praca?: Praca
  contexto?: CTAContexto
  titulo?: string
  mensagemCustom?: string
}

export function useWhatsApp({
  praca = 'rj',
  contexto = 'generico',
  titulo = '',
  mensagemCustom,
}: UseWhatsAppOptions = {}) {
  const numero = WHATSAPP_NUMEROS[praca]

  const getMensagem = useCallback(() => {
    if (mensagemCustom) return mensagemCustom
    switch (contexto) {
      case 'imovel':     return WHATSAPP_MENSAGENS.imovel(titulo)
      case 'condominio': return WHATSAPP_MENSAGENS.condominio(titulo)
      case 'bairro':     return WHATSAPP_MENSAGENS.bairro(titulo)
      case 'tour':       return WHATSAPP_MENSAGENS.tour(titulo)
      default:           return WHATSAPP_MENSAGENS.generico()
    }
  }, [contexto, titulo, mensagemCustom])

  const getUrl = useCallback(() => {
    const msg = encodeURIComponent(getMensagem())
    return `https://wa.me/${numero}?text=${msg}`
  }, [numero, getMensagem])

  return { getUrl, numero, getMensagem }
}
