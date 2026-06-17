/**
 * Root layout — shell mínimo.
 * O layout completo (fontes, providers, Navbar, Footer) fica em [locale]/layout.tsx.
 * Este shell é necessário para rotas fora do [locale] (ex: /studio) e para o not-found global.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
