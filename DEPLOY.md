# Deployment Guide

## Quick Deploy

### Option 1: Using npm (Easiest)
```bash
npm run deploy
```

This will:
- Add all changes
- Commit with message "Update portfolio site"
- Push to GitHub

### Option 2: Using the deploy script
```bash
bash deploy.sh "Your custom commit message"
```

Or with default message:
```bash
bash deploy.sh
```

### Option 3: Manual commands
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Troubleshooting

If you get permission denied:
```bash
chmod +x deploy.sh
bash deploy.sh
```

If push fails (remote has changes):
```bash
git pull --rebase origin main
git push origin main
```

## After Deployment

- Wait 2-3 minutes for GitHub Pages to rebuild
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check your site at: https://swayyum.github.io

