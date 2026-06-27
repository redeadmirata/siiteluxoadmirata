import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  test: {
    // Ambiente jsdom — simula o DOM do browser
    environment: 'jsdom',

    // Setup global — jest-dom matchers
    setupFiles: ['./src/test/setup.ts'],

    // Globals — permite usar describe/it/expect sem import
    globals: true,

    // Padrão de arquivos de teste
    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
    ],

    exclude: [
      'node_modules',
      '.next',
      'sanity',
    ],

    // Coverage com v8
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',       // barrel files — só re-exports
        'src/app/**',        // Next.js pages — testadas via e2e
        'sanity/**',
        '.next/**',
      ],
      thresholds: {
        functions: 60,
        branches: 60,
        lines: 60,
      },
    },
  },

  resolve: {
    alias: {
      '@':            resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/lib':        resolve(__dirname, './src/lib'),
      '@/hooks':      resolve(__dirname, './src/hooks'),
      '@/services':   resolve(__dirname, './src/services'),
      '@/utils':      resolve(__dirname, './src/utils'),
      '@/types':      resolve(__dirname, './src/types'),
      '@/config':     resolve(__dirname, './src/config'),
      '@/sanity':     resolve(__dirname, './src/sanity'),
      '@/styles':     resolve(__dirname, './src/styles'),
      '@/providers':  resolve(__dirname, './src/providers'),
      '@/test':       resolve(__dirname, './src/test'),
    },
  },
})
