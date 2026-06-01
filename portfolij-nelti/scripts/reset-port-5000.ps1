# Free TCP port 5000 (Windows) and start the portfolio server with a clean bind.
$ErrorActionPreference = 'SilentlyContinue'
$port = 5000

$pids = [System.Collections.Generic.HashSet[int]]::new()
Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.OwningProcess -and $_.OwningProcess -ne 0) { [void]$pids.Add($_.OwningProcess) }
}

foreach ($procId in $pids) {
    Write-Host "Stopping PID $procId (was using port $port)..."
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Milliseconds 400

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$env:PORT = '5000'
$env:HOST = '0.0.0.0'

Write-Host "Starting Node on http://localhost:5000/ ..."
node server.js
