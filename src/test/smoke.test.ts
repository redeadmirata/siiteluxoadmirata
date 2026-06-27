/**
 * Smoke test — valida que o ambiente de testes está funcionando.
 * Deve passar sem nenhuma dependência de componente ou Sanity.
 */
import { describe, it, expect } from 'vitest'

describe('ambiente de testes', () => {
  it('vitest está funcionando', () => {
    expect(1 + 1).toBe(2)
  })

  it('TypeScript strict types funcionam', () => {
    const values: string[] = ['Admirata', 'Imóveis']
    expect(values).toHaveLength(2)
    expect(values[0]).toBe('Admirata')
  })

  it('async/await funciona', async () => {
    const result = await Promise.resolve('ok')
    expect(result).toBe('ok')
  })
})
