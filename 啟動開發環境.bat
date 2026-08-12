@echo off
cd /d "%~dp0"

start /min "動漫資訊站－後端" cmd /k "cd /d backend && npm run dev"
start /min "動漫資訊站－前端" cmd /k "cd /d frontend && npm run dev"