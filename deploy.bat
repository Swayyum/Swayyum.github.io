@echo off
REM Copyright © 2025 Sam Analytic Solutions
REM All rights reserved.

REM Automated git deploy script for Windows

echo 🚀 Starting deployment...

REM Check if there are changes to commit
git diff --quiet
if %errorlevel% equ 0 (
    git diff --cached --quiet
    if %errorlevel% equ 0 (
        echo ⚠️  No changes to commit
        exit /b 0
    )
)

REM Get commit message from argument or use default
set COMMIT_MSG=%1
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update portfolio site

echo 📦 Adding all changes...
git add .

echo 💾 Committing changes...
git commit -m "%COMMIT_MSG%"

if %errorlevel% neq 0 (
    echo ❌ Commit failed
    exit /b 1
)

echo 📤 Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully deployed to GitHub!
    echo ⏳ Wait 2-3 minutes for GitHub Pages to rebuild
) else (
    echo ❌ Push failed. You may need to pull first:
    echo    git pull --rebase origin main
    exit /b 1
)

