# Redeploy — inclui arquivo de verificação GSC
cd "C:\Users\Admir\OneDrive\Documentos\Claude\Projects\Site luxo admirata"
Write-Host "Verificando arquivo GSC..." -ForegroundColor Cyan
if (Test-Path "public\google9df4ed741234663c.html") {
    Write-Host "  OK: arquivo de verificacao presente" -ForegroundColor Green
} else {
    Write-Host "  ERRO: arquivo nao encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "Deploy de producao..." -ForegroundColor Cyan
vercel --prod --yes
