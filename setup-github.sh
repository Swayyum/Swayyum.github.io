#!/bin/bash
# Copyright © 2025 Sam Analytic Solutions
# All rights reserved.

# Script to set up GitHub repository and push portfolio site

echo "🚀 Setting up GitHub repository for portfolio site..."
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists."
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL (e.g., https://github.com/Swayyum/Swayyum.github.io.git): " repo_url
        git remote set-url origin "$repo_url"
    else
        echo "Keeping existing remote."
    fi
else
    read -p "Enter your GitHub repository URL (e.g., https://github.com/Swayyum/Swayyum.github.io.git): " repo_url
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Go to your repository on GitHub"
    echo "2. Click on 'Settings'"
    echo "3. Scroll down to 'Pages' section"
    echo "4. Under 'Source', select 'main' branch"
    echo "5. Click 'Save'"
    echo ""
    echo "Your site will be live at: https://Swayyum.github.io"
else
    echo ""
    echo "❌ Failed to push. Please check:"
    echo "   - Repository URL is correct"
    echo "   - You have push access"
    echo "   - Repository exists on GitHub"
fi

