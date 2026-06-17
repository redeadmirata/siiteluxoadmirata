export async function GET() {
  return new Response('google-site-verification: google9df4ed741234663c.html', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
