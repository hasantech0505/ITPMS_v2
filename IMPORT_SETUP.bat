@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "Expand-Archive -Force 'itpms_import.zip' '.'"
findstr /b "EXCEL_SOURCE_DIR" .env >nul 2>&1 || type dotenv_note.txt >> .env
call IMPORT_EXCEL.bat
