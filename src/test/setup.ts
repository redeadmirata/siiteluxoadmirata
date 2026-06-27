/**
 * Vitest setup — roda antes de cada arquivo de teste.
 *
 * Importa os matchers do @testing-library/jest-dom para ter:
 *   expect(element).toBeInTheDocument()
 *   expect(element).toHaveTextContent('...')
 *   expect(element).toBeVisible()
 *   etc.
 */
import '@testing-library/jest-dom'
