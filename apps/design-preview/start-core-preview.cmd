@echo off
setlocal
cd /d "%~dp0"
node scripts\start-preview.mjs --core
if errorlevel 1 pause
