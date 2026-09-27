# Stops the locally deployed app (backend :8080 + frontend :5173).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/stop-deploy.ps1
$deploy = Join-Path (Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent) 'deploy'

foreach ($pidFile in @('backend.pid', 'frontend.pid')) {
    $f = Join-Path $deploy $pidFile
    if (Test-Path $f) {
        $id = (Get-Content $f -Raw).Trim()
        try { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue; Write-Output "stopped pid $id ($pidFile)" } catch {}
        Remove-Item $f -Force -ErrorAction SilentlyContinue
    }
}
foreach ($port in @(8080, 5173)) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Output "freed port $port (pid $($c.OwningProcess))" } catch {}
    }
}
Write-Output 'done.'
