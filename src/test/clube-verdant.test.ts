import { describe, expect, it } from 'vitest'
import {
  CLUBE_DIAS,
  CLUBE_PUBLICOS,
  GRADE_WELLNESS_VERDANT,
  PROGRAMA_WELLNESS_VERDANT,
} from '@/data/clube-verdant-programacao'

describe('programação oficial do Clube Verdant', () => {
  it('mantém horários, dias e públicos dentro dos contratos suportados', () => {
    expect(PROGRAMA_WELLNESS_VERDANT.length).toBeGreaterThan(30)

    for (const aula of PROGRAMA_WELLNESS_VERDANT) {
      expect(aula.horario).toMatch(/^\d{2}:\d{2}$/)
      expect(aula.dias.length).toBeGreaterThan(0)
      expect(aula.publicos.length).toBeGreaterThan(0)
      expect(aula.dias.every((dia) => CLUBE_DIAS.includes(dia))).toBe(true)
      expect(aula.publicos.every((publico) => CLUBE_PUBLICOS.includes(publico))).toBe(true)
    }
  })

  it('preserva a resolução original e o texto alternativo da grade', () => {
    expect(GRADE_WELLNESS_VERDANT.width).toBe(1313)
    expect(GRADE_WELLNESS_VERDANT.height).toBe(2019)
    expect(GRADE_WELLNESS_VERDANT.src).toBe('/images/clube-verdant/programacao-wellness.jpg')
    expect(GRADE_WELLNESS_VERDANT.alt).toContain('Programação Wellness oficial')
  })
})
