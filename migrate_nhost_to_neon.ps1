# ===========================================================================
#  Migrate the ITPMS database from Nhost to Neon
#  ---------------------------------------------------------------------
#      .\migrate_nhost_to_neon.ps1
#          export fresh from Nhost, then import into Neon
#
#      .\migrate_nhost_to_neon.ps1 -UseDump nhost_backup_20260915-223820.sql
#          skip the export and import an existing dump file
#
#  Reads both connection strings from .env, so no password is ever typed.
# ===========================================================================

param(
    [string]$UseDump = ""
)

$ErrorActionPreference = "Stop"

# --- 1. Find pg_dump and psql ----------------------------------------------
foreach ($v in @("18", "17", "16", "15")) {
    $bin = "C:\Program Files\PostgreSQL\$v\bin"
    if (Test-Path $bin) { $env:Path = "$bin;$env:Path"; break }
}
foreach ($tool in @("pg_dump", "psql")) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: '$tool' not found." -ForegroundColor Red; exit 1
    }
}
Write-Host "Found: $((pg_dump --version))" -ForegroundColor Green

# --- 2. Read both connection strings from .env ------------------------------
$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) { Write-Host "ERROR: .env not found." -ForegroundColor Red; exit 1 }
$lines = Get-Content $envPath

$neon  = (($lines | Where-Object { $_ -match '^\s*DATABASE_URL=' } | Select-Object -First 1) `
          -replace '^\s*DATABASE_URL=', '').Trim()
$nhost = (($lines | Where-Object { $_ -match '^\s*#\s*DATABASE_URL=.*nhost' } | Select-Object -First 1) `
          -replace '^\s*#\s*DATABASE_URL=', '').Trim()

if (-not $neon) { Write-Host "ERROR: no active DATABASE_URL in .env" -ForegroundColor Red; exit 1 }
if ($neon -notmatch 'neon\.tech') { Write-Host "ERROR: active DATABASE_URL is not Neon." -ForegroundColor Red; exit 1 }

Write-Host "`nTarget (Neon): $([regex]::Replace($neon, ':[^:@/]+@', ':****@'))"

# --- 3. Export from Nhost (or reuse an existing dump) -----------------------
if ($UseDump) {
    if (-not (Test-Path $UseDump)) { Write-Host "ERROR: dump not found: $UseDump" -ForegroundColor Red; exit 1 }
    $dump = $UseDump
    Write-Host "Reusing existing dump: $dump" -ForegroundColor Cyan
} else {
    if (-not $nhost) { Write-Host "ERROR: no commented Nhost DATABASE_URL in .env" -ForegroundColor Red; exit 1 }
    Write-Host "Source (Nhost): $([regex]::Replace($nhost, ':[^:@/]+@', ':****@'))"

    $dump = "nhost_backup_$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
    Write-Host "`nExporting from Nhost -> $dump" -ForegroundColor Cyan
    Write-Host "(if Nhost is asleep this will hang - wake it in the dashboard first)"
    pg_dump $nhost --schema=public --no-owner --no-privileges -f $dump
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: pg_dump failed." -ForegroundColor Red; exit 1 }
}

# --- 4. Sanity-check the dump BEFORE touching Neon --------------------------
$copyCount = (Select-String -Path $dump -Pattern '^COPY ').Count
$sizeKB    = [math]::Round((Get-Item $dump).Length / 1KB, 1)
Write-Host "Dump: $sizeKB KB, $copyCount tables with data" -ForegroundColor Green
if ($copyCount -eq 0) {
    Write-Host "`nSTOPPING: the dump contains no table data. Neon untouched." -ForegroundColor Red; exit 1
}

# Does the dump create the public schema itself? pg_dump --schema=public
# usually emits "CREATE SCHEMA public;". If it does, we must only DROP the
# schema here and let the dump recreate it - creating it ourselves as well is
# what made the previous run fail with: schema "public" already exists.
$dumpCreatesSchema = [bool](Select-String -Path $dump -Pattern '^CREATE SCHEMA public;' -Quiet)
Write-Host "Dump creates schema itself: $dumpCreatesSchema"

# --- 5. Confirm, then clear Neon -------------------------------------------
Write-Host "`nAbout to REPLACE everything in the Neon database." -ForegroundColor Yellow
$answer = Read-Host "Type YES to continue"
if ($answer -ne "YES") { Write-Host "Cancelled. Nothing changed."; exit 0 }

# --- 6. Clear and import, in ONE transaction --------------------------------
# psql runs -c and -f in the order given, and --single-transaction wraps ALL of
# them in one BEGIN/COMMIT. So the DROP and the import succeed together or fail
# together. An earlier version ran the DROP separately, which meant a failed
# import left the database with no public schema at all - worse than before it
# started. This cannot happen now.
Write-Host "Clearing and importing in a single transaction..." -ForegroundColor Cyan

if ($dumpCreatesSchema) {
    # The dump contains its own CREATE SCHEMA public, so only drop here.
    psql $neon -v ON_ERROR_STOP=1 --single-transaction `
         -c "DROP SCHEMA IF EXISTS public CASCADE;" `
         -f $dump
} else {
    psql $neon -v ON_ERROR_STOP=1 --single-transaction `
         -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" `
         -f $dump
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: import failed. Everything was rolled back -" -ForegroundColor Red
    Write-Host "the database is exactly as it was before this script ran."
    Write-Host "Your dump is safe at: $dump"
    exit 1
}

# --- 7. Compare both databases ----------------------------------------------
$counts = @"
SELECT 'users' AS t, count(*) FROM users
UNION ALL SELECT 'residents',    count(*) FROM residents
UNION ALL SELECT 'startups',     count(*) FROM startups
UNION ALL SELECT 'companies',    count(*) FROM companies
UNION ALL SELECT 'contacts',     count(*) FROM contacts
UNION ALL SELECT 'buildings',    count(*) FROM buildings
UNION ALL SELECT 'entity_store', count(*) FROM entity_store
ORDER BY 1;
"@

Write-Host "`n--- NEON (target) ---" -ForegroundColor Cyan
psql $neon -c $counts
Write-Host "--- residents by status ---" -ForegroundColor Cyan
psql $neon -c "SELECT status, count(*) FROM residents GROUP BY status ORDER BY status;"

if ($nhost -and -not $UseDump) {
    Write-Host "--- NHOST (source, for comparison) ---" -ForegroundColor Cyan
    psql $nhost -c $counts
}

Write-Host "`nDone. Keep $dump safe - it is your backup." -ForegroundColor Green
Write-Host "Next: psql `$neon -v ON_ERROR_STOP=1 -f fix_resident_duplicates.sql"
