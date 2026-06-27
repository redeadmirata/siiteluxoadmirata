'use client'

/**
 * ThemeProvider — Admirata
 *
 * Controla o tema claro/escuro via classe no <html>.
 * Persiste em localStorage e respeita prefers-color-scheme.
 *
 * Uso:
 *   const { theme, setTheme, isDark } = useTheme()
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  /** Preferência do usuário: 'light' | 'dark' | 'system' */
  theme: Theme
  /** Tema efetivo após resolução do 'system' */
  resolvedTheme: ResolvedTheme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'admirata_theme'
const ATTR = 'data-theme'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.setAttribute(ATTR, resolved)
  // Classe Tailwind dark: para quem usar dark: utilities
  root.classList.toggle('dark', resolved === 'dark')
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

  // Lê preferência salva na montagem
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const initial: Theme = stored ?? 'system'
    const resolved = resolveTheme(initial)
    setThemeState(initial)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  // Observa mudança de preferência do sistema quando theme === 'system'
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    const resolved = resolveTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, isDark: resolvedTheme === 'dark', setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Script inline — evita flash (FOUC) ───────────────────────────────────────
// Adicionar no <head> antes do <body> para aplicar tema antes da hidratação.
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var t = localStorage.getItem('admirata_theme') || 'system';
        var r = t === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : t;
        document.documentElement.setAttribute('data-theme', r);
        if (r === 'dark') document.documentElement.classList.add('dark');
      } catch(e) {}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
  return ctx
}
