# ===========================================================================
#  ITPMS -> Neon : restore the database and apply the resident fixes
#  ---------------------------------------------------------------------
#  Run it once, with the dev server STOPPED:
#
#      .\setup_neon.ps1
#
#  It will:
#    1. find psql
#    2. read the Neon connection string from .env
#    3. pick the newest nhost_backup_*.sql in this folder
#    4. drop + import in ONE transaction (all of it, or none of it)
#    5. apply fix_resident_duplicates.sql
#    6. print and verify the result
#
#  Everything is written to neon_setup.log as well as the screen.
# ===========================================================================

param(
    [string]$UseDump = "",
    [switch]$SkipFix
)

$ErrorActionPreference = "Stop"
$log = Join-Path $PSScriptRoot "neon_setup.log"
"=== ITPMS Neon setup - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File $log -Encoding utf8

function Say($msg, $colour = "Gray") {
    Write-Host $msg -ForegroundColor $colour
    $msg | Out-File $log -Append -Encoding utf8
}
function Run($arguments) {
    # Run psql, show output AND append it to the log, keep psql's exit code.
    & psql @arguments 2>&1 | Tee-Object -FilePath $log -Append
    return $LASTEXITCODE
}

# --- 1. psql ----------------------------------------------------------------
foreach ($v in @("18", "17", "16", "15")) {
    $bin = "C:\Program Files\PostgreSQL\$v\bin"
    if (Test-Path $bin) { $env:Path = "$bin;$env:Path"; break }
}
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    Say "ERROR: psql not found. Install the PostgreSQL client tools." "Red"; exit 1
}
Say "psql: $((psql --version))" "Green"

# --- 2. Neon connection string from .env ------------------------------------
$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) { Say "ERROR: .env not found." "Red"; exit 1 }

$neon = ((Get-Content $envPath | Where-Object { $_ -match '^\s*DATABASE_URL=' } |
          Select-Object -First 1) -replace '^\s*DATABASE_URL=', '').Trim()

if (-not $neon)                     { Say "ERROR: no active DATABASE_URL in .env" "Red"; exit 1 }
if ($neon -notmatch 'neon\.tech')   { Say "ERROR: active DATABASE_URL is not Neon." "Red"; exit 1 }
Say "target: $([regex]::Replace($neon, ':[^:@/]+@', ':****@'))"

# --- 3. Pick the dump -------------------------------------------------------
if ($UseDump) {
    $dump = $UseDump
} else {
    $newest = Get-ChildItem -Path $PSScriptRoot -Filter "nhost_backup_*.sql" -ErrorAction SilentlyContinue |
              Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $newest) { Say "ERROR: no nhost_backup_*.sql found in this folder." "Red"; exit 1 }
    $dump = $newest.FullName
}
if (-not (Test-Path $dump)) { Say "ERROR: dump not found: $dump" "Red"; exit 1 }

$copyCount = (Select-String -Path $dump -Pattern '^COPY ').Count
$sizeKB    = [math]::Round((Get-Item $dump).Length / 1KB, 1)
Say "dump  : $(Split-Path $dump -Leaf)  ($sizeKB KB, $copyCount tables with data)"
if ($copyCount -eq 0) { Say "ERROR: dump has no table data. Nothing done." "Red"; exit 1 }

$dumpCreatesSchema = [bool](Select-String -Path $dump -Pattern '^CREATE SCHEMA public;' -Quiet)

# --- 4. Confirm -------------------------------------------------------------
Write-Host ""
Write-Host "This REPLACES the whole Neon database with the contents of that dump." -ForegroundColor Yellow
Write-Host "Make sure 'npm run dev' is STOPPED before continuing." -ForegroundColor Yellow
if ((Read-Host "Type YES to continue") -ne "YES") { Say "cancelled by user - nothing changed."; exit 0 }

# --- 5. Drop + import as ONE transaction ------------------------------------
# psql runs -c and -f in the order given; --single-transaction wraps them all
# in one BEGIN/COMMIT. If the import fails, the drop rolls back with it, so the
# database can never be left half-way.
Say "`n[1/3] importing..." "Cyan"
$dropSql = if ($dumpCreatesSchema) { "DROP SCHEMA IF EXISTS public CASCADE;" }
           else { "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" }

$code = Run @("$neon", "-v", "ON_ERROR_STOP=1", "--single-transaction", "-c", $dropSql, "-f", "$dump")
if ($code -ne 0) {
    Say "`nFAILED at import. Everything rolled back - the database is unchanged." "Red"
    Say "Send Claude the file: neon_setup.log" "Yellow"
    exit 1
}
Say "      import OK" "Green"

# --- 6. Resident fixes ------------------------------------------------------
$fix = Join-Path $PSScriptRoot "fix_resident_duplicates.sql"
if (-not $SkipFix -and (Test-Path $fix)) {
    Say "`n[2/3] applying resident fixes..." "Cyan"
    $code = Run @("$neon", "-v", "ON_ERROR_STOP=1", "-f", "$fix")
    if ($code -ne 0) {
        Say "`nFAILED applying fix_resident_duplicates.sql (the import above is fine)." "Red"
        Say "Send Claude the file: neon_setup.log" "Yellow"
        exit 1
    }
    Say "      fixes OK" "Green"
} else {
    Say "`n[2/3] skipping resident fixes"
}

# --- 7. Verify --------------------------------------------------------------
Say "`n[3/3] verifying..." "Cyan"
Run @("$neon", "-c", @"
SELECT 'users' AS table, count(*) FROM users
UNION ALL SELECT 'residents',    count(*) FROM residents
UNION ALL SELECT 'startups',     count(*) FROM startups
UNION ALL SELECT 'companies',    count(*) FROM companies
UNION ALL SELECT 'contacts',     count(*) FROM contacts
UNION ALL SELECT 'buildings',    count(*) FROM buildings
UNION ALL SELECT 'entity_store', count(*) FROM entity_store
ORDER BY 1;
"@) | Out-Null

Run @("$neon", "-c", "SELECT status, count(*) FROM residents GROUP BY status ORDER BY status;") | Out-Null

Say "`nDONE." "Green"
Say "ACTIVE residents should read 78. If it does, run: npm run dev"
Say "Full log: neon_setup.log"
