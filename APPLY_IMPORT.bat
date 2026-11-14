@echo off
cd /d "%~dp0"
echo This will WRITE the Excel data into the website database (a backup is made first).
echo Make sure the server window is closed.
pause
call npm run import:excel:apply
pause
