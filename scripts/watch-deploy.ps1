# Watches deploy/ for new Jenkins artifacts and redeploys the app.
# Jenkins "Deploy to Local" writes: codelab-backend-<N>.jar, codelab-frontend-<N>.zip, .latest-build
# This script deploys build N: backend JAR on :8080, frontend dist on :5173.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/watch-deploy.ps1
# Stop with Ctrl+C, or run scripts/stop-deploy.ps1 to also stop the app.

$ErrorActionPreference = 'Stop'
$root = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent
$deploy = Join-Path $root 'deploy'
$marker = Join-Path $deploy '.latest-build'
$state  = Join-Path $deploy '.deployed-build'

function Free-Port($port) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
    if ($conns) { Start-Sleep -Seconds 2 }
}

function Wait-Http($url, $timeoutSec = 60) {
    $deadline = (Get-Date).AddSeconds($timeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) { return $true }
        } catch { Start-Sleep -Seconds 2 }
    }
    return $false
}

function Deploy-Build($n) {
    $jar = Join-Path $deploy "codelab-backend-$n.jar"
    $zip = Join-Path $deploy "codelab-frontend-$n.zip"
    $dist = Join-Path $deploy 'frontend-dist'

    Write-Output "[deploy] deploying build #$n ..."

    # --- backend ---
    Free-Port 8080
    $backendLog = Join-Path $deploy 'backend.log'
    $p = Start-Process -FilePath 'java' -ArgumentList '-jar', "`"$jar`"" `
        -RedirectStandardOutput $backendLog -RedirectStandardError "$backendLog.err" -PassThru
    $p.Id | Out-File (Join-Path $deploy 'backend.pid')
    if (-not (Wait-Http 'http://localhost:8080/api/files')) { throw "backend #$n did not come up on :8080" }
    Write-Output "[deploy] backend #$n live on :8080 (pid $($p.Id))"

    # --- frontend ---
    if (Test-Path $dist) { Remove-Item -Recurse -Force $dist }
    Expand-Archive -LiteralPath $zip -DestinationPath $dist -Force
    Free-Port 5173
    $feLog = Join-Path $deploy 'frontend.log'
    $serve = Join-Path $root 'scripts/serve-dist.mjs'
    $fp = Start-Process -FilePath 'node' -ArgumentList "`"$serve`"", "`"$dist`"", '5173' `
        -RedirectStandardOutput $feLog -RedirectStandardError "$feLog.err" -PassThru
    $fp.Id | Out-File (Join-Path $deploy 'frontend.pid')
    if (-not (Wait-Http 'http://localhost:5173/')) { throw "frontend #$n did not come up on :5173" }
    Write-Output "[deploy] frontend #$n live on :5173 (pid $($fp.Id))"

    $n | Out-File $state
    Write-Output "[deploy] build #$n deployed. Refresh http://localhost:5173 to see it."
}

Write-Output "[deploy] watching $deploy (Ctrl+C to stop watching; app keeps running)"
while ($true) {
    try {
        if (Test-Path $marker) {
            $latest = (Get-Content $marker -Raw).Trim()
            $done = if (Test-Path $state) { (Get-Content $state -Raw).Trim() } else { '' }
            if ($latest -ne '' -and $latest -ne $done) {
                $jar = Join-Path $deploy "codelab-backend-$latest.jar"
                $zip = Join-Path $deploy "codelab-frontend-$latest.zip"
                if ((Test-Path $jar) -and (Test-Path $zip)) {
                    $s1 = (Get-Item $jar).Length + (Get-Item $zip).Length
                    Start-Sleep -Seconds 3
                    $s2 = (Get-Item $jar).Length + (Get-Item $zip).Length
                    if ($s1 -eq $s2) { Deploy-Build $latest }
                }
            }
        }
    } catch { Write-Output "[deploy] ERROR: $($_.Exception.Message)" }
    Start-Sleep -Seconds 5
}
