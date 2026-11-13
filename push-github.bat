@echo off
cd /d "%~dp0"
git config user.email anjkee@gmail.com
git config user.name "Lenoy Andrew"
git init
git remote remove origin 2>nul
git remote add origin https://github.com/myflowexotic/declarant-interview-survey.git
git add .
git diff --staged --quiet
if errorlevel 1 git commit -m "anketa"
git branch -M main
git push -u origin main
pause
