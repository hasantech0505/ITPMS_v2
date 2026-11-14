# ===========================================================================
#  Apply the resident fixes to Neon and verify.
#  Does NOT touch anything else - no import, no wipe.
#
#      .\fix_residents.ps1
# ===========================================================================

$ErrorActionPreference = "Stop"
$log = Join-Path $PSScriptRoot "neon_fix.log"
"=== resident fix - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File $log -Encoding utf8

foreach ($v in @("18", "17", "16", "15")) {
    $bin = "C:\Program Files\PostgreSQL\$v\bin"
    if (Test-Path $bin) { $env:Path = "$bin;$env:Path"; break }
}
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: psql not found." -ForegroundColor Red; exit 1
}

$neon = ((Get-Content (Join-Path $PSScriptRoot ".env") |
          Where-Object { $_ -match '^\s*DATABASE_URL=' } |
          Select-Object -First 1) -replace '^\s*DATABASE_URL=', '').Trim()

if ($neon -notmatch 'neon\.tech') { Write-Host "ERROR: DATABASE_URL is not Neon." -ForegroundColor Red; exit 1 }
Write-Host "target: $([regex]::Replace($neon, ':[^:@/]+@', ':****@'))"

Write-Host "`nApplying fix_resident_duplicates.sql ..." -ForegroundColor Cyan
& psql "$neon" -v ON_ERROR_STOP=1 -f (Join-Path $PSScriptRoot "fix_resident_duplicates.sql") 2>&1 |
    Tee-Object -FilePath $log -Append

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nFAILED. Send Claude the file: neon_fix.log" -ForegroundColor Red
    exit 1
}

Write-Host "`nFull table counts:" -ForegroundColor Cyan
& psql "$neon" -c @"
SELECT 'users' AS table, count(*) FROM users
UNION ALL SELECT 'residents',    count(*) FROM residents
UNION ALL SELECT 'startups',     count(*) FROM startups
UNION ALL SELECT 'companies',    count(*) FROM companies
UNION ALL SELECT 'contacts',     count(*) FROM contacts
UNION ALL SELECT 'buildings',    count(*) FROM buildings
UNION ALL SELECT 'entity_store', count(*) FROM entity_store
ORDER BY 1;
"@ 2>&1 | Tee-Object -FilePath $log -Append

Write-Host "`nDone. ACTIVE residents should read 78." -ForegroundColor Green
Write-Host "Then: npm run dev"
