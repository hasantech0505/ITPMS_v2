@echo off
cd /d "%~dp0"
echo === ITPMS Excel import: PREVIEW (nothing is changed) ===
call npm install
call npm run import:excel
echo.
echo Report saved to server\import-report.txt
echo To really apply, close the server and run APPLY_IMPORT.bat
pause
