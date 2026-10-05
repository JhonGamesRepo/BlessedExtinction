# Conecta el bot de Telegram con el Worker publicado.
#   powershell -ExecutionPolicy Bypass -File dev\set-webhook.ps1
# Pide el token del bot sin mostrarlo y usa el WEBHOOK_SECRET guardado en .webhook-secret
# (el mismo que se subió a Cloudflare). Ninguno de los dos queda en pantalla ni en el historial.
param(
  [string]$WorkerUrl = 'https://blessed-chat.blessed-chat.workers.dev'
)

$secretFile = Join-Path $PSScriptRoot '..\.webhook-secret'
if (-not (Test-Path $secretFile)) { Write-Error 'No existe .webhook-secret'; exit 1 }
$secret = (Get-Content $secretFile -Raw).Trim()

$secure = Read-Host 'Pega el token del bot (no se mostrará)' -AsSecureString
$token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))

try {
  $res = Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$token/setWebhook" -Body @{
    url                  = "$WorkerUrl/telegram"
    secret_token         = $secret
    allowed_updates      = '["message"]'
    drop_pending_updates = 'true'
  }
  Write-Host "setWebhook: ok=$($res.ok) — $($res.description)"
  $info = Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getWebhookInfo"
  Write-Host "Webhook activo en: $($info.result.url)"
  if ($info.result.last_error_message) { Write-Host "Último error: $($info.result.last_error_message)" }
  $me = Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getMe"
  Write-Host "Bot: @$($me.result.username) — escribe /id@$($me.result.username) en el grupo"
} catch {
  Write-Host "Error: $($_.Exception.Message)  (¿token correcto?)"
} finally {
  $token = $null
}
